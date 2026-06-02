using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;
using Crm.Application.Features.Products.Dtos;

namespace Crm.Application.Features.Products.Queries.ListProducts;

public sealed class ListProductsQuery : IQuery<PagedResult<ProductListItem>>
{
    public PaginationRequest Pagination { get; init; } = new();
    public ProductListFilter Filters { get; init; } = new();
}
