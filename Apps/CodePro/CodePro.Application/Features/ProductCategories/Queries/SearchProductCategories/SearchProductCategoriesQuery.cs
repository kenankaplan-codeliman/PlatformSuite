using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;
using Platform.Application.Modals.Common;

namespace CodePro.Application.Features.ProductCategories.Queries.SearchProductCategories;

public sealed class SearchProductCategoriesQuery : IQuery<PagedResult<EntityReference>>
{
    public string? SearchText { get; init; }
    public PaginationRequest Pagination { get; init; } = new();
}
