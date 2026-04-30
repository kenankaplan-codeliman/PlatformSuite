using CodePro.Application.Features.PurchaseRequests.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;

namespace CodePro.Application.Features.PurchaseRequests.Queries.ListPurchaseRequests;

public sealed class ListPurchaseRequestsQuery : IQuery<PagedResult<PurchaseRequestListItem>>
{
    public PaginationRequest Pagination { get; init; } = new();
    public PurchaseRequestListFilter Filters { get; init; } = new();
}
