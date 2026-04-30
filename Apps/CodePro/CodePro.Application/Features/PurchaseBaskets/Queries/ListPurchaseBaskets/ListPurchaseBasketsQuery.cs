using CodePro.Application.Features.PurchaseBaskets.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;

namespace CodePro.Application.Features.PurchaseBaskets.Queries.ListPurchaseBaskets;

public sealed class ListPurchaseBasketsQuery : IQuery<PagedResult<PurchaseBasketListItem>>
{
    public PaginationRequest Pagination { get; init; } = new();
    public PurchaseBasketListFilter Filters { get; init; } = new();
}
