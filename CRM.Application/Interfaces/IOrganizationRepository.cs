using CRM.Domain.Entities.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Interfaces
{
    public interface IOrganizationRepository : IRepository<AppOrganization>
    {
        Task<AppOrganization?> GetDefaultAsync();
        Task<List<Guid>> GetOrganizationHierarchy(Guid organizationId);
    }


}
