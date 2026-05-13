using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Platform.Application.Features.AppRoles.Dtos;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Platform.Application.Features.AppRoles.Queries.ListAppRoles;

public sealed class ListAppRolesHandler : IRequestHandler<ListAppRolesQuery, Result<PagedResult<AppRoleListItem>>>
{
    private readonly IApplicationDbContext _db;

    public ListAppRolesHandler(IApplicationDbContext db) => _db = db;

    public async Task<Result<PagedResult<AppRoleListItem>>> Handle(ListAppRolesQuery request, CancellationToken cancellationToken)
    {
        var query = _db.AppRole.AsNoTracking();
        var filters = request.Filters;

        if (!string.IsNullOrWhiteSpace(filters.RoleName))
        {
            var pattern = $"%{filters.RoleName}%";
            query = query.Where(r => EF.Functions.ILike(r.RoleName, pattern));
        }

        if (filters.IsActive.HasValue)
            query = query.Where(r => r.IsActive == filters.IsActive.Value);

        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var pageIndex = Math.Max(pageNumber - 1, 0);
        var skip = pageIndex * pageSize;

        var items = await query
            .OrderBy(r => r.RoleName)
            .Skip(skip)
            .Take(pageSize + 1)
            .ProjectToType<AppRoleListItem>()
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > pageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        return new PagedResult<AppRoleListItem>
        {
            Data = items,
            Pagination = new PaginationResponse
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                HasMoreRecord = hasMore,
            },
        };
    }
}
