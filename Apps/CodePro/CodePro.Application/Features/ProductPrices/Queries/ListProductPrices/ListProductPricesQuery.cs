using CodePro.Application.Features.ProductPrices.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;

namespace CodePro.Application.Features.ProductPrices.Queries.ListProductPrices;

public sealed class ListProductPricesQuery : IQuery<PagedResult<ProductPriceListItem>>
{
    public PaginationRequest Pagination { get; init; } = new();
    public ProductPriceListFilter Filters { get; init; } = new();
}
