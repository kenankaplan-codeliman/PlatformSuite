using CRM.Domain.Entities.Identities;
using CRM.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Interfaces
{
    public interface IRoleRepository : IEntityRepository<AppRole>
    {
        Task CreatePrivileges(CancellationToken cancellationToken = default);
        Task<AppRole> GetOrCreateAsync(string roleName, AccessLevel accessLevel, bool isDefault = false, CancellationToken cancellationToken = default);
        Task<AppRole?> GetDefaultRole(CancellationToken cancellationToken = default);

        Task<List<AppRole>> GetUserRole(Guid userId, CancellationToken cancellationToken = default);

        Task AddUserRole(Guid userId, List<Guid> roleIds, CancellationToken cancellationToken = default);
    }
}
