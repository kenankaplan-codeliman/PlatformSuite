using CRM.Application.Modals.Common;
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
        PaginationResult<Lead> List(LeadListFilter? filter, PaginationInfo? paginationInfo);

        PaginationResult<EntityReference> Search(string searchText, PaginationInfo? paginationInfo);
    }
}
