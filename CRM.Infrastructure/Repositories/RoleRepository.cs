using CRM.Application.Exceptions;
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
                                from ur in dbContext.AppUserRole
                                join r in dbContext.AppRole on ur.RoleId equals r.Id
                                where r.IsActive && ur.IsActive && ur.UserId == userId
                                select r
                            ).ToList();
            return roles;
        }

        public void AddUserRole(Guid userId, List<Guid> roleIds)
        {
            var userRoles = GetUserRole(userId);

            var userRolesIds = userRoles.Select(ur => ur.Id);

            var newRoleIds = roleIds.Where(rId => !userRolesIds.Contains(rId));

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
        
    }
}
