using CodePro.Application.Features.Products.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;

namespace CodePro.Application.Features.Products.Queries.ListProducts;

public sealed class ListProductsQuery : IQuery<PagedResult<ProductListItem>>
{
    public PaginationRequest Pagination { get; init; } = new();
    public ProductListFilter Filters { get; init; } = new();
}
