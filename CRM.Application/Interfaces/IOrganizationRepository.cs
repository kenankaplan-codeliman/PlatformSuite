using CRM.Domain.Entities.Identities;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Interfaces
{
    public interface IOrganizationRepository : IEntityRepository<AppOrganization>
    {
        Task<AppOrganization?> GetDefaultOrganization(CancellationToken cancellationToken = default);
        Task<AppOrganization> GetOrCreateDefaultOrganization(CancellationToken cancellationToken = default);
        Task<Dictionary<Guid, string>> GetOrganizationHierarchyAsync(Guid organizationId, CancellationToken cancellationToken = default);
    }


}
