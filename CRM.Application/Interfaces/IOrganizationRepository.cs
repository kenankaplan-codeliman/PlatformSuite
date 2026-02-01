using CRM.Domain.Entities.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Interfaces
{
    public interface IOrganizationRepository : IEntityRepository<AppOrganization>
    {
        Task<AppOrganization?> GetDefaultOrganizationAsync();
        Task<List<Guid>> GetOrganizationHierarchy(Guid organizationId);
    }


}
