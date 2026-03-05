using CRM.Application.Modals.AccountModal;
using CRM.Application.Modals.Common;
using CRM.Application.Modals.OpportunityModal;
using CRM.Domain.Entities.Opportunities;

namespace CRM.Application.Interfaces;

public interface IOpportunityRepository : IEntityRepository<Opportunity>
{
    Task<PaginationResult<OpportunityListItem>> List(OpportunityListFilters filter, PaginationInfo paginationInfo, CancellationToken cancellationToken = default);
}
