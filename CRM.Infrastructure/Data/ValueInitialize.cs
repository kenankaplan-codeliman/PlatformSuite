using CRM.Domain.Authorization;
using CRM.Domain.Entities.Identity;
using CRM.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace CRM.Infrastructure.Data
{
    public static class ValueInitialize
    {
      

        public static async Task CreateAdminUser(DatabaseContext dbContext, Guid defOrganizationId, Guid defaultAdminRoleId)
        {
            if (await dbContext.AppUser.AnyAsync())
                return;

            var adminUser = new AppUser
            {
                FirstName = "Admin",
                LastName = "User",
                Email = "admin",
                OrganizationId = defOrganizationId, 
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin")
            };

            await dbContext.AppUser.AddAsync(adminUser);

            await dbContext.AppUserRole.AddAsync(new AppUserRole()
            {
                UserId = adminUser.Id,
                RoleId = defaultAdminRoleId 
            });

            await dbContext.SaveChangesAsync();
        }

        public static async Task<Guid> validateRole(DatabaseContext dbContext, string roleName, AccessLevel accessLevel, bool isDefault = false)
        {
            var roleId = await dbContext.AppRole.IgnoreQueryFilters()
                                    .AsNoTracking()
                                    .Where(o => o.IsActive && o.RoleName == roleName)
                                    .Select(o => o.Id)
                                    .FirstOrDefaultAsync();

            if (Guid.Empty.Equals(roleId))
            {
                AppRole role = new AppRole()
                {
                    RoleName = roleName,
                    Description = $"Avalilable for {roleName} Users",
                    IsDefault = isDefault,
                };

                await dbContext.AppRole.AddAsync(role);
                roleId = role.Id;
            }

            await createRolePrivileges(dbContext, roleId, accessLevel);

            await dbContext.SaveChangesAsync();

            return roleId;
        }

        private async static Task createRolePrivileges(DatabaseContext dbContext, Guid roleId, AccessLevel accessLevel) {

            //Temnplate Role Privileges from Constants
            var temlateRolePrivileges = PrivilegeRegistry.All.Select(privCode => new AppRolePrivilege()
            {
                AccessLevel = accessLevel,
                RoleId = roleId,
                PrivilegeCode = privCode,
            }).ToList();

            //Exist Role Privileges
            var existPrivCodes = await dbContext.AppRolePrivilege.Where(rp => rp.RoleId == roleId).Select(rp => rp.PrivilegeCode).ToListAsync();


            var notExistsRolePrivileges = temlateRolePrivileges.Where(rp => !existPrivCodes.Contains(rp.PrivilegeCode)).ToList();

            await dbContext.AddRangeAsync(notExistsRolePrivileges);
        }

        public async static Task validatePrivileges(DatabaseContext dbContext)
        {

            //Temnplate Role Privileges from Constants
            var temlateRolePrivileges = PrivilegeRegistry.All.Select(privCode => new AppPrivilege()
            {
                PrivilegeCode = privCode,
                PrivilegeName = privCode,   

            }).ToList();

            //Exist Role Privileges
            var existPrivCodes = await dbContext.AppPrivilege.Select(p=> p.PrivilegeCode).ToListAsync();


            var notExistsRolePrivileges = temlateRolePrivileges.Where(rp => !existPrivCodes.Contains(rp.PrivilegeCode)).ToList();

            await dbContext.AddRangeAsync(notExistsRolePrivileges);
            await dbContext.SaveChangesAsync();
        }


        public static async Task<Guid> validateDefaultOrganization(DatabaseContext dbContext)
        {
            var defOrganizationId = await dbContext.AppOrganization.IgnoreQueryFilters()
                                .AsNoTracking()
                                .Where(o => o.IsActive && !o.IsDeleted && o.IsDefault)
                                .Select(o => o.Id)
                                .FirstOrDefaultAsync();

            if (Guid.Empty.Equals(defOrganizationId))
            {

                AppOrganization organization = new AppOrganization()
                {
                    OrganizationCode = "HQ",
                    OrganizationName = "Headquarters",
                    IsDefault = true
                };

                await dbContext.AppOrganization.AddAsync(organization);
                await dbContext.SaveChangesAsync();

                defOrganizationId = organization.Id;
            }

            return defOrganizationId;
        }
    }
}