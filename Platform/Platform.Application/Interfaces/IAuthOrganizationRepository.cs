using Platform.Domain.Entities.Identities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Platform.Application.Interfaces
{
    public interface IAuthOrganizationRepository : IEntityRepository<AuthOrganization>
    {
        Task<AuthOrganization?> GetDefaultOrganization(CancellationToken cancellationToken = default);
        Task<AuthOrganization> GetOrCreateDefaultOrganization(CancellationToken cancellationToken = default);
        Task<Dictionary<Guid, string>> GetOrganizationHierarchyAsync(Guid organizationId, CancellationToken cancellationToken = default);
    }


}
