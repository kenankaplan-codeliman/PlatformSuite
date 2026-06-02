using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;
using Crm.Application.Features.Products.Dtos;

namespace Crm.Application.Features.Products.Queries.SearchProducts;

public sealed class SearchProductsQuery : IQuery<PagedResult<ProductLookupItem>>
{
    public string? SearchText { get; init; }
    public PaginationRequest Pagination { get; init; } = new();
}
