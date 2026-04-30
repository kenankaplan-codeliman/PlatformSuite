using CodePro.Application.Features.ProductCategories.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;

namespace CodePro.Application.Features.ProductCategories.Queries.ListProductCategories;

public sealed class ListProductCategoriesQuery : IQuery<PagedResult<ProductCategoryListItem>>
{
    public PaginationRequest Pagination { get; init; } = new();
    public ProductCategoryListFilter Filters { get; init; } = new();
}
