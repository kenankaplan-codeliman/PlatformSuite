using CRM.Domain.Authorization;
using CRM.Domain.Entities.Identity;
using CRM.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace CRM.Infrastructure.Data
{
    public static class ValueInitialize
    {
      

        public static void CreateAdminUser(DatabaseContext dbContext, Guid defOrganizationId, Guid defaultAdminRoleId)
        {
            if (dbContext.AppUser.Any())
                return;

            var adminUser = new AppUser
            {
                FirstName = "Admin",
                LastName = "User",
                Email = "admin",
                OrganizationId = defOrganizationId, 
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin")
            };

            dbContext.AppUser.Add(adminUser);

            dbContext.AppUserRole.Add(new AppUserRole()
            {
                UserId = adminUser.Id,
                RoleId = defaultAdminRoleId 
            });

            dbContext.SaveChanges();
        }

        public static Guid validateRole(DatabaseContext dbContext, string roleName, AccessLevel accessLevel, bool isDefault = false)
        {
            var roleId = dbContext.AppRole.IgnoreQueryFilters()
                                    .AsNoTracking()
                                    .Where(o => o.IsActive && o.RoleName == roleName)
                                    .Select(o => o.Id)
                                    .FirstOrDefault();

            if (Guid.Empty.Equals(roleId))
            {
                AppRole role = new AppRole()
                {
                    RoleName = roleName,
                    Description = $"Avalilable for {roleName} Users",
                    IsDefault = isDefault,
                };

                dbContext.AppRole.Add(role);
                roleId = role.Id;
            }

            createRolePrivileges(dbContext, roleId, accessLevel);

            dbContext.SaveChanges();

            return roleId;
        }

        private async static void createRolePrivileges(DatabaseContext dbContext, Guid roleId, AccessLevel accessLevel) {

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

            dbContext.AddRange(notExistsRolePrivileges);
        }

        public async static void validatePrivileges(DatabaseContext dbContext)
        {

            //Temnplate Role Privileges from Constants
            var temlateRolePrivileges = PrivilegeRegistry.All.Select(privCode => new AppPrivilege()
            {
                PrivilegeCode = privCode,
                PrivilegeName = privCode,   

            }).ToList();

            //Exist Role Privileges
            var existPrivCodes = dbContext.AppPrivilege.Select(p=> p.PrivilegeCode).ToList();


            var notExistsRolePrivileges = temlateRolePrivileges.Where(rp => !existPrivCodes.Contains(rp.PrivilegeCode)).ToList();

            dbContext.AddRange(notExistsRolePrivileges);
            dbContext.SaveChanges();
        }


        public static Guid validateDefaultOrganization(DatabaseContext dbContext)
        {
            var defOrganizationId = dbContext.AppOrganization.IgnoreQueryFilters()
                                .AsNoTracking()
                                .Where(o => o.IsActive && !o.IsDeleted && o.IsDefault)
                                .Select(o => o.Id)
                                .FirstOrDefault();

            if (Guid.Empty.Equals(defOrganizationId))
            {

                AppOrganization organization = new AppOrganization()
                {
                    OrganizationCode = "HQ",
                    OrganizationName = "Headquarters",
                    IsDefault = true
                };

                dbContext.AppOrganization.Add(organization);
                dbContext.SaveChanges();

                defOrganizationId = organization.Id;
            }

            return defOrganizationId;
        }
    }
}