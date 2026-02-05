using CRM.Application.Modals.Common;
using CRM.Domain.Entities.Identity;
using CRM.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Interfaces
{
    public interface IUserRepository : IEntityRepository<AppUser>
    {
        AppUser? GetByEmail(string email);
        AppUser? GetByAzureUserId(string microsoftAzureUserId);
        Dictionary<string, AccessLevel> GetPrivileges(Guid userId);
    }
}
