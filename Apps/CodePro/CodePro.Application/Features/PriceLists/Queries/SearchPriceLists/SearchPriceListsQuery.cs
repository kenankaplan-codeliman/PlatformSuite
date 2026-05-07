using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;
using Platform.Application.Modals.Common;

namespace CodePro.Application.Features.PriceLists.Queries.SearchPriceLists;

public sealed class SearchPriceListsQuery : IQuery<PagedResult<EntityReference>>
{
    public string? SearchText { get; init; }
    public PaginationRequest Pagination { get; init; } = new();
}
