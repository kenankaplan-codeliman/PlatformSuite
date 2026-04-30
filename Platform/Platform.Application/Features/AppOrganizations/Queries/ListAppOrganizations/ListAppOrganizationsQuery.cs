using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;
using Platform.Application.Features.AppOrganizations.Dtos;

namespace Platform.Application.Features.AppOrganizations.Queries.ListAppOrganizations;

public sealed class ListAppOrganizationsQuery : IQuery<PagedResult<AppOrganizationListItem>>
{
    public PaginationRequest Pagination { get; init; } = new();
    public AppOrganizationListFilter Filters { get; init; } = new();
}
