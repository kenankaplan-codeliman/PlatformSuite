using CRM.Domain.Entities.Identities;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Interfaces
{
    public interface IOrganizationRepository : IEntityRepository<AppOrganization>
    {
        AppOrganization? GetDefaultOrganization();
        Task<AppOrganization> GetOrCreateDefaultOrganization();
        Dictionary<Guid, string> GetOrganizationHierarchy(Guid organizationId);
    }


}
