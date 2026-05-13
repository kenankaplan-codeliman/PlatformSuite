using Platform.Application.Modals.Common;
using Platform.Domain.Entities.Identities;
using Platform.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Platform.Application.Interfaces
{
    public interface IAuthUserRepository : IEntityRepository<AuthUser>
    {

        Task<AuthUser> GetOrCreateAsync(string email, string firstName, string lastName, string? password = null, string? azureUserId = null, Guid? organizationId = null, List<Guid>? roleIds = null, CancellationToken cancellationToken = default);

        Task<AuthUser?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
        Task<Dictionary<string, AccessLevel>> GetUserPrivilegesAsync(Guid userId, CancellationToken cancellationToken = default);
    }
}
