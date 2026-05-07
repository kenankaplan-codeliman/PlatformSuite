using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;
using Platform.Application.Modals.Common;

namespace Platform.Application.Features.AppOrganizations.Queries.SearchAppOrganizations;

public sealed class SearchAppOrganizationsQuery : IQuery<PagedResult<EntityReference>>
{
    public string? SearchText { get; init; }
    public PaginationRequest Pagination { get; init; } = new();
}
