using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;
using Platform.Application.Features.AppUsers.Dtos;

namespace Platform.Application.Features.AppUsers.Queries.ListAppUsers;

public sealed class ListAppUsersQuery : IQuery<PagedResult<AppUserListItem>>
{
    public PaginationRequest Pagination { get; init; } = new();
    public AppUserListFilter Filters { get; init; } = new();
}
