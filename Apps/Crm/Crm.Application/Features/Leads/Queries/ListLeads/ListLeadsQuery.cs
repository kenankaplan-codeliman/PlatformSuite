using Crm.Application.Features.Leads.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;

namespace Crm.Application.Features.Leads.Queries.ListLeads;

public sealed class ListLeadsQuery : IQuery<PagedResult<LeadListItem>>
{
    public PaginationRequest Pagination { get; init; } = new();
    public LeadListFilter Filters { get; init; } = new();
}
