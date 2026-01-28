using CRM.Domain.Entities.Identity;
using CRM.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Interfaces
{
    public interface IUserRepository : IEntityRepository<AppUser>
    {
        Task<AppUser?> GetByEmailAsync(string email);
        Task<AppUser?> GetByAzureUserIdAsync(string microsoft365Id);
        Task<Dictionary<string, AccessLevel>> GetPrivileges(Guid userId);
        Task<AccessLevel> GetAccessLevel(Guid userId, string privilegeCode);
    }
}
