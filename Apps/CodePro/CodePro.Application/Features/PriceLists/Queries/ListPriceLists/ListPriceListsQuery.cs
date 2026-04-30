using CodePro.Application.Features.PriceLists.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;

namespace CodePro.Application.Features.PriceLists.Queries.ListPriceLists;

public sealed class ListPriceListsQuery : IQuery<PagedResult<PriceListListItem>>
{
    public PaginationRequest Pagination { get; init; } = new();
    public PriceListListFilter Filters { get; init; } = new();
}
