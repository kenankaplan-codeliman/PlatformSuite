using CRM.Application.Modals.LeadModal;
using CRM.Domain.Entities.Identity;
using CRM.Domain.Entities.Lead;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Interfaces
{
    public interface ILeadRepository : IEntityRepository<Lead>
    {
        Task<LeadListResponse> ListAsync(LeadListFilter? filter, int page, int pageSize);
    }
}
