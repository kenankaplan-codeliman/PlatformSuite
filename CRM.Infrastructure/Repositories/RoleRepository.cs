using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Modals.Common;
using CRM.Domain.Authorization;
using CRM.Domain.Entities.Identity;
using CRM.Domain.Enums;
using CRM.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace CRM.Infrastructure.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly DatabaseContext dbContext;

        public RoleRepository(DatabaseContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public AppRole Get(Guid Id)
        {
            return dbContext.AppRole.FirstOrDefault(x => x.Id == Id) ?? throw new NotFoundException();
        }

        public AppRole? GetDefaultRole()
        {
            return dbContext.AppRole.FirstOrDefault(x => x.IsDefault);
        }

        public AppRole Create(AppRole entity)
        {
            var entry = dbContext.AppRole.Add(entity);
            return entry.Entity;
        }
        public AppRole Update(AppRole entity)
        {
            var entry = dbContext.AppRole.Update(entity);
            return entry.Entity;
        }

        public AppRole Delete(AppRole entity)
        {
            var entry = dbContext.AppRole.Remove(entity);
            return entry.Entity;
        }

        public List<AppRole> GetUserRole(Guid userId)
        {
            var roles = (
                        from ur in dbContext.AppUserRole.AsNoTracking()
                        join r in dbContext.AppRole on ur.RoleId equals r.Id
                        where r.IsActive && ur.IsActive && ur.UserId == userId
                        select r
                        ).ToList();
            return roles;
        }

        public void AddUserRole(Guid userId, List<Guid> roleIds)
        {
            var userRoles = GetUserRole(userId);

            var existRoleIds = userRoles.Select(ur => ur.Id);

            var newRoleIds = roleIds.Where(rId => !existRoleIds.Contains(rId));

            foreach (var roleId in newRoleIds)
            {
                dbContext.AppUserRole.Add(new AppUserRole()
                {
                    UserId = userId,
                    RoleId = roleId
                });
            }

            dbContext.SaveChanges();
        }

        public async Task<AppRole> GetOrCreateAsync(string roleName, AccessLevel accessLevel, bool isDefault = false)
        {

            var role = dbContext.AppRole
                                        .IgnoreQueryFilters()
                                        .AsNoTracking()
                                        .Where(o => o.IsActive && o.RoleName == roleName)
                                        .FirstOrDefault();

            if (role != null)
            {
                await CreateRolePrivileges(role.Id, accessLevel);
                return role;
            }

            role = new AppRole()
            {
                RoleName = roleName,
                Description = $"Avalilable for {roleName} Users",
                IsDefault = isDefault,
            };

            dbContext.AppRole.Add(role);

            await CreateRolePrivileges(role.Id, accessLevel);

            await dbContext.SaveChangesAsync();

            return role;

        }

        private async Task CreateRolePrivileges(Guid roleId, AccessLevel accessLevel)
        {

            //Temnplate Role Privileges from Constants
            var temlateRolePrivileges = PrivilegeRegistry.All.Select(privCode => new AppRolePrivilege()
            {
                AccessLevel = accessLevel,
                RoleId = roleId,
                PrivilegeCode = privCode,
            }).ToList();

            //Exist Role Privileges
            var existPrivCodes = dbContext.AppRolePrivilege.Where(rp => rp.RoleId == roleId).Select(rp => rp.PrivilegeCode).ToList();


            var notExistsRolePrivileges = temlateRolePrivileges.Where(rp => !existPrivCodes.Contains(rp.PrivilegeCode)).ToList();

            if (notExistsRolePrivileges.Count > 0)
            {
                await dbContext.AddRangeAsync(notExistsRolePrivileges);
                await dbContext.SaveChangesAsync();
            }
        }

        public async Task CreatePrivileges()
        {

            //Temnplate Role Privileges from Constants
            var temlateRolePrivileges = PrivilegeRegistry.All.Select(privCode => new AppPrivilege()
            {
                PrivilegeCode = privCode,
                PrivilegeName = privCode,

            }).ToList();

            //Exist Role Privileges
            var existPrivCodes = dbContext.AppPrivilege.Select(p => p.PrivilegeCode).ToList();

            var notExistsPrivileges = temlateRolePrivileges.Where(rp => !existPrivCodes.Contains(rp.PrivilegeCode)).ToList();

            if (notExistsPrivileges.Count > 0)
            {
                await dbContext.AddRangeAsync(notExistsPrivileges);
                await dbContext.SaveChangesAsync();
            }
        }

        
    }
}

