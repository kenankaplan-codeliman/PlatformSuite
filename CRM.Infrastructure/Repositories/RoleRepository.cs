using CRM.Application.Interfaces;
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

        public async Task<AppRole?> GetAsync(Guid Id)
        {
            return await dbContext.AppRole.FirstOrDefaultAsync(x => x.Id == Id);
        }

        public async Task<AppRole?> GetDefaultRoleAsync()
        {
            return await dbContext.AppRole.FirstOrDefaultAsync(x => x.IsDefault);
        }

        public async Task<AppRole> CreateAsync(AppRole entity)
        {
            var entry = await dbContext.AppRole.AddAsync(entity);
            return entry.Entity;
        }
        public async Task<AppRole> UpdateAsync(AppRole entity)
        {
            var entry = dbContext.AppRole.Update(entity);
            return entry.Entity;
        }

        public async Task<AppRole> DeleteAsync(AppRole entity)
        {
            var entry = dbContext.AppRole.Remove(entity);
            return entry.Entity;
        }

        public async Task<List<AppRole>> GetUserRoleAsync(Guid userId)
        {
            var roles = await (
                                from ur in dbContext.AppUserRole
                                join r in dbContext.AppRole on ur.RoleId equals r.Id
                                where r.IsActive && ur.IsActive && ur.UserId == userId
                                select r
                            ).ToListAsync();
            return roles;
        }

        public async Task AddUserRoleAsync(Guid userId, List<Guid> roleIds)
        {
            var userRoles = await GetUserRoleAsync(userId);

            var userRolesIds = userRoles.Select(ur => ur.Id);

            var newRoleIds = roleIds.Where(rId => !userRolesIds.Contains(rId));

            foreach (var roleId in newRoleIds)
            {
                await dbContext.AppUserRole.AddAsync(new AppUserRole()
                {
                    UserId = userId,
                    RoleId = roleId
                });
            }

            await dbContext.SaveChangesAsync();
        }

        public async Task RemoveUserRoleAsync(Guid userId, Guid roleId)
        {
            throw new NotImplementedException();
        }

        public async Task<List<AppPrivilege>> GetRolePrivilegesAsync(Guid roleId)
        {
            throw new NotImplementedException();
        }

        public async Task AddRolePrivilegesAsync(Guid roleId, Guid privilegesId, AccessLevel accessLevel)
        {
            throw new NotImplementedException();
        }

        public async Task RemoveRolePrivilegesAsync(Guid roleId, Guid privilegesId)
        {
            throw new NotImplementedException();
        }
    }
}
