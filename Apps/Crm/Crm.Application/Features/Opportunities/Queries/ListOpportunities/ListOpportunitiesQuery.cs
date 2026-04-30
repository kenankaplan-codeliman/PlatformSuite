using Crm.Application.Features.Opportunities.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;

namespace Crm.Application.Features.Opportunities.Queries.ListOpportunities;

public sealed class ListOpportunitiesQuery : IQuery<PagedResult<OpportunityListItem>>
{
    public PaginationRequest Pagination { get; init; } = new();
    public OpportunityListFilter Filters { get; init; } = new();
}
