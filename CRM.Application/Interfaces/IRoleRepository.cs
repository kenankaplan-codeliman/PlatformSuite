using CRM.Domain.Entities.Identity;
using CRM.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Interfaces
{
    public interface IRoleRepository : IEntityRepository<AppRole>
    {
        Task<AppRole?> GetDefaultRoleAsync();

        //User Role
        Task<List<AppRole>> GetUserRoleAsync(Guid userId);
        Task AddUserRoleAsync(Guid userId, List<Guid> roleIds);
        Task RemoveUserRoleAsync(Guid userId, Guid roleId);

        //Role Privileges
        Task<List<AppPrivilege>> GetRolePrivilegesAsync(Guid roleId);
        Task AddRolePrivilegesAsync(Guid roleId, Guid privilegesId, AccessLevel accessLevel);
        Task RemoveRolePrivilegesAsync(Guid roleId, Guid privilegesId);
    }
}
