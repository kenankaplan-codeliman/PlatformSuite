using Platform.Domain.Entities.Identities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Platform.Application.Interfaces
{
    public interface IOrganizationRepository : IEntityRepository<Organization>
    {
        Task<Organization?> GetDefaultOrganization(CancellationToken cancellationToken = default);
        Task<Organization> GetOrCreateDefaultOrganization(CancellationToken cancellationToken = default);
        Task<Dictionary<Guid, string>> GetOrganizationHierarchyAsync(Guid organizationId, CancellationToken cancellationToken = default);
    }


}
