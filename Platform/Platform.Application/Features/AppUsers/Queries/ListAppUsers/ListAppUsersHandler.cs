using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Platform.Application.Features.AppUsers.Dtos;
using Platform.Application.Modals.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Platform.Application.Features.AppUsers.Queries.ListAppUsers;

public sealed class ListAppUsersHandler : IRequestHandler<ListAppUsersQuery, Result<PagedResult<AppUserListItem>>>
{
    private readonly IApplicationDbContext _db;

    public ListAppUsersHandler(IApplicationDbContext db) => _db = db;

    public async Task<Result<PagedResult<AppUserListItem>>> Handle(ListAppUsersQuery request, CancellationToken cancellationToken)
    {
        var query = _db.AuthUser.AsNoTracking();
        var filters = request.Filters;

        if (!string.IsNullOrWhiteSpace(filters.FullName))
        {
            var pattern = $"%{filters.FullName}%";
            query = query.Where(u =>
                EF.Functions.ILike(u.FirstName, pattern)
                || EF.Functions.ILike(u.LastName, pattern));
        }

        if (!string.IsNullOrWhiteSpace(filters.Email))
        {
            var pattern = $"%{filters.Email}%";
            query = query.Where(u => EF.Functions.ILike(u.Email, pattern));
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
            .Select(u => new
            {
                u.Id,
                u.Email,
                u.FirstName,
                u.LastName,
                u.PhoneNumber,
                u.IsActive,
                Org = _db.AuthOrganization.Where(o => o.Id == u.OrganizationId)
                    .Select(o => new { o.Id, o.OrganizationName, o.Title })
                    .FirstOrDefault(),
                Mgr = u.ManagerId.HasValue
                    ? _db.AuthUser.Where(m => m.Id == u.ManagerId)
                        .Select(m => new { m.Id, m.FirstName, m.LastName, m.Email })
                        .FirstOrDefault()
                    : null,
            })
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > pageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        var result = items.Select(u => new AppUserListItem
        {
            Id = u.Id,
            Email = u.Email,
            FirstName = u.FirstName,
            LastName = u.LastName,
            PhoneNumber = u.PhoneNumber,
            IsActive = u.IsActive,
            Organization = u.Org == null ? null : new EntityReference("Organization")
            {
                Id = u.Org.Id,
                Name = u.Org.Title ?? u.Org.OrganizationName,
            },
            Manager = u.Mgr == null ? null : new EntityReference("User")
            {
                Id = u.Mgr.Id,
                Name = u.Mgr.FirstName + " " + u.Mgr.LastName,
                Email = u.Mgr.Email,
            },
        }).ToList();

        return new PagedResult<AppUserListItem>
        {
            Data = result,
            Pagination = new PaginationResponse
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                HasMoreRecord = hasMore,
            },
        };
    }
}
