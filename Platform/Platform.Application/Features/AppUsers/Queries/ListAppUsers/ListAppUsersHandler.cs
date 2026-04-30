using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Platform.Application.Features.AppUsers.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Platform.Application.Features.AppUsers.Queries.ListAppUsers;

public sealed class ListAppUsersHandler : IRequestHandler<ListAppUsersQuery, Result<PagedResult<AppUserListItem>>>
{
    private readonly IApplicationDbContext _db;

    public ListAppUsersHandler(IApplicationDbContext db) => _db = db;

    public async Task<Result<PagedResult<AppUserListItem>>> Handle(ListAppUsersQuery request, CancellationToken cancellationToken)
    {
        var query = _db.AppUser.AsNoTracking();
        var filters = request.Filters;

        if (!string.IsNullOrWhiteSpace(filters.FullName))
        {
            var pattern = filters.FullName.ToLower();
            query = query.Where(u =>
                u.FirstName.ToLower().Contains(pattern)
                || u.LastName.ToLower().Contains(pattern));
        }

        if (!string.IsNullOrWhiteSpace(filters.Email))
        {
            var pattern = filters.Email.ToLower();
            query = query.Where(u => u.Email.ToLower().Contains(pattern));
        }

        if (filters.OrganizationId.HasValue)
            query = query.Where(u => u.OrganizationId == filters.OrganizationId.Value);

        if (filters.IsActive.HasValue)
            query = query.Where(u => u.IsActive == filters.IsActive.Value);

        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var pageIndex = Math.Max(pageNumber - 1, 0);
        var skip = pageIndex * pageSize;

        var items = await query
            .OrderBy(u => u.FirstName).ThenBy(u => u.LastName)
            .Skip(skip)
            .Take(pageSize + 1)
            .Select(u => new AppUserListItem
            {
                Id = u.Id,
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName,
                PhoneNumber = u.PhoneNumber,
                OrganizationId = u.OrganizationId,
                OrganizationName = _db.AppOrganization.Where(o => o.Id == u.OrganizationId)
                    .Select(o => o.OrganizationName).FirstOrDefault(),
                ManagerId = u.ManagerId,
                ManagerName = u.ManagerId.HasValue
                    ? _db.AppUser.Where(m => m.Id == u.ManagerId).Select(m => m.FirstName + " " + m.LastName).FirstOrDefault()
                    : null,
                IsActive = u.IsActive,
            })
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > pageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        return new PagedResult<AppUserListItem>
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
