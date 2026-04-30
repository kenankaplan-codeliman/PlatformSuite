using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;
using Platform.Application.Features.AppRoles.Dtos;

namespace Platform.Application.Features.AppRoles.Queries.ListAppRoles;

public sealed class ListAppRolesQuery : IQuery<PagedResult<AppRoleListItem>>
{
    public PaginationRequest Pagination { get; init; } = new();
    public AppRoleListFilter Filters { get; init; } = new();
}
