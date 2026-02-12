using CRM.Application.Modals.Common;
using CRM.Domain.Entities.Identities;
using CRM.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Interfaces
{
    public interface IUserRepository : IEntityRepository<AppUser>
    {
        
        Task<AppUser> GetOrCreateAsync(string email, string firstName, string lastName, string? password = null, string? azureUserId = null, Guid? organizationId = null, List<Guid>? roleIds = null);

        AppUser? GetByEmail(string email);
        Dictionary<string, AccessLevel> GetUserPrivileges(Guid userId);
    }
}
