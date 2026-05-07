using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;
using Platform.Application.Modals.Common;

namespace CodePro.Application.Features.Products.Queries.SearchProducts;

public sealed class SearchProductsQuery : IQuery<PagedResult<EntityReference>>
{
    public string? SearchText { get; init; }
    public PaginationRequest Pagination { get; init; } = new();
}
