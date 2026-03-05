using CRM.Application.Modals.Common;
using CRM.Application.Modals.LeadModal;
using CRM.Domain.Entities.Identities;
using CRM.Domain.Entities.Leads;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Interfaces
{
    public interface ILeadRepository : IEntityRepository<Lead>
    {
        Task<PaginationResult<LeadListItem>> List(LeadListFilter filter, PaginationInfo paginationInfo, CancellationToken cancellationToken = default);
    }
}
