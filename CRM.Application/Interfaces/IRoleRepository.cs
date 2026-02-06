using CRM.Domain.Entities.Identity;
using CRM.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Interfaces
{
    public interface IRoleRepository : IEntityRepository<AppRole>
    {
        Task CreatePrivileges();
        Task<AppRole> GetOrCreateAsync(string roleName, AccessLevel accessLevel, bool isDefault = false);
        AppRole? GetDefaultRole();

        //User Role
        List<AppRole> GetUserRole(Guid userId);
        //Role Privileges

        void AddUserRole(Guid userId, List<Guid> roleIds);


       
    }
}
