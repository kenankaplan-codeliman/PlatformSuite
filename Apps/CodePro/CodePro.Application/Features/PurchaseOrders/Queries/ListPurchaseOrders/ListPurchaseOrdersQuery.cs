using CodePro.Application.Features.PurchaseOrders.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;

namespace CodePro.Application.Features.PurchaseOrders.Queries.ListPurchaseOrders;

public sealed class ListPurchaseOrdersQuery : IQuery<PagedResult<PurchaseOrderListItem>>
{
    public PaginationRequest Pagination { get; init; } = new();
    public PurchaseOrderListFilter Filters { get; init; } = new();
}
