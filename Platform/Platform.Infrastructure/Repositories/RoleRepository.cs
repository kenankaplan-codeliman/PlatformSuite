using Platform.Application.Exceptions;
using Platform.Application.Interfaces;
using Platform.Application.Modals.Common;
using Platform.Domain.Authorization;
using Platform.Domain.Entities.Identities;
using Platform.Domain.Enums;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Platform.Infrastructure.Repositories
{
    public class RoleRepository : BaseEntityRepository<AppRole>, IRoleRepository
    {
        public RoleRepository(PlatformDbContext dbContext) : base(dbContext)
        {
        }

        public override async Task<AppRole?> GetAsync(Guid Id, CancellationToken cancellationToken = default)
        {
            return await dbContext.AppRole.FirstOrDefaultAsync(x => x.Id == Id, cancellationToken);
        }

        public async Task<AppRole?> GetDefaultRole(CancellationToken cancellationToken = default)
        {
            return await dbContext.AppRole.FirstOrDefaultAsync(x => x.IsDefault, cancellationToken);
        }


        public async Task<List<AppRole>> GetUserRole(Guid userId, CancellationToken cancellationToken = default)
        {
            return await (
                    from ur in dbContext.AppUserRole.AsNoTracking()
                    join r in dbContext.AppRole on ur.RoleId equals r.Id
                    where r.IsActive && ur.IsActive && ur.UserId == userId
                    select r
                    ).ToListAsync(cancellationToken);
        }

        public async Task AddUserRole(Guid userId, List<Guid> roleIds, CancellationToken cancellationToken = default)
        {
            var userRoles = await GetUserRole(userId, cancellationToken);

            var existRoleIds = userRoles.Select(ur => ur.Id).ToHashSet();

            var newUserRoles = roleIds
                .Where(rId => !existRoleIds.Contains(rId))
                .Select(roleId => new AppUserRole { UserId = userId, RoleId = roleId })
                .ToList();

            if (newUserRoles.Any())
            {
                dbContext.AppUserRole.AddRange(newUserRoles);
                await dbContext.SaveChangesAsync(cancellationToken);
            }
        }

        public async Task SyncUserRolesAsync(Guid userId, List<Guid> roleIds, CancellationToken cancellationToken = default)
        {
            var existing = await dbContext.AppUserRole
                .Where(ur => ur.UserId == userId)
                .ToListAsync(cancellationToken);

            var desired = roleIds.ToHashSet();
            var existingIds = existing.Select(e => e.RoleId).ToHashSet();

            var toRemove = existing.Where(e => !desired.Contains(e.RoleId)).ToList();
            if (toRemove.Count > 0) dbContext.AppUserRole.RemoveRange(toRemove);

            var toAdd = roleIds
                .Where(rid => !existingIds.Contains(rid))
                .Select(rid => new AppUserRole { UserId = userId, RoleId = rid })
                .ToList();
            if (toAdd.Count > 0) dbContext.AppUserRole.AddRange(toAdd);

            if (toRemove.Count > 0 || toAdd.Count > 0)
                await dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task SyncRolePrivilegesAsync(Guid roleId, List<RolePrivilegeAssignment> privileges, CancellationToken cancellationToken = default)
        {
            var existing = await dbContext.AppRolePrivilege
                .Where(rp => rp.RoleId == roleId)
                .ToListAsync(cancellationToken);

            var desiredByCode = privileges.ToDictionary(p => p.PrivilegeCode, p => p.AccessLevel);
            var existingByCode = existing.ToDictionary(e => e.PrivilegeCode, e => e);

            var toRemove = existing.Where(e => !desiredByCode.ContainsKey(e.PrivilegeCode)).ToList();
            if (toRemove.Count > 0) dbContext.AppRolePrivilege.RemoveRange(toRemove);

            foreach (var (code, level) in desiredByCode)
            {
                if (existingByCode.TryGetValue(code, out var current))
                {
                    if (current.AccessLevel != level) current.AccessLevel = level;
                }
                else
                {
                    dbContext.AppRolePrivilege.Add(new AppRolePrivilege
                    {
                        RoleId = roleId,
                        PrivilegeCode = code,
                        AccessLevel = level,
                    });
                }
            }

            await dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<AppRole> GetOrCreateAsync(
                                                     string roleName,
                                                     AccessLevel accessLevel,
                                                     bool isDefault = false,
                                                     CancellationToken cancellationToken = default)
        {
            var role = await dbContext.AppRole
            .Where(o => o.IsActive && o.RoleName == roleName)
            .FirstOrDefaultAsync(cancellationToken);

            if (role != null)
            {
                await CreateRolePrivileges(role.Id, accessLevel, cancellationToken);
                return role;
            }

            role = new AppRole
            {
                RoleName = roleName,
                Description = $"Available for {roleName} Users",
                IsDefault = isDefault,
            };

            dbContext.AppRole.Add(role);

            await dbContext.SaveChangesAsync(cancellationToken);

            await CreateRolePrivileges(role.Id, accessLevel, cancellationToken);

            return role;
        }

        private async Task CreateRolePrivileges(Guid roleId, AccessLevel accessLevel, CancellationToken cancellationToken = default)
        {
            var templateRolePrivileges = PrivilegeRegistry.All
            .Select(privCode => new AppRolePrivilege
            {
                AccessLevel = accessLevel,
                RoleId = roleId,
                PrivilegeCode = privCode,
            }).ToList();

            var existPrivCodes = (await dbContext.AppRolePrivilege
                .Where(rp => rp.RoleId == roleId)
                .Select(rp => rp.PrivilegeCode)
                .ToListAsync(cancellationToken))
                .ToHashSet();

            var notExistsRolePrivileges = templateRolePrivileges
                .Where(rp => !existPrivCodes.Contains(rp.PrivilegeCode))
                .ToList();

            if (notExistsRolePrivileges.Any())
            {
                dbContext.AddRange(notExistsRolePrivileges);
                await dbContext.SaveChangesAsync(cancellationToken);
            }
        }

        public async Task CreatePrivileges(CancellationToken cancellationToken = default)
        {
            var templatePrivileges = PrivilegeRegistry.All
            .Select(privCode => new AppPrivilege
            {
                PrivilegeCode = privCode,
                PrivilegeName = privCode,
            }).ToList();

            var existPrivCodes = (await dbContext.AppPrivilege
                .Select(p => p.PrivilegeCode)
                .ToListAsync(cancellationToken))
                .ToHashSet();

            var notExistsPrivileges = templatePrivileges
                .Where(p => !existPrivCodes.Contains(p.PrivilegeCode))
                .ToList();

            if (notExistsPrivileges.Any())
            {
                dbContext.AddRange(notExistsPrivileges);
                await dbContext.SaveChangesAsync(cancellationToken);
            }
        }


    }
}

