using CodePro.Application.Features.ProductCatalogs.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;

namespace CodePro.Application.Features.ProductCatalogs.Queries.ListProductCatalogs;

public sealed class ListProductCatalogsQuery : IQuery<PagedResult<ProductCatalogListItem>>
{
    public PaginationRequest Pagination { get; init; } = new();
    public ProductCatalogListFilter Filters { get; init; } = new();
}
