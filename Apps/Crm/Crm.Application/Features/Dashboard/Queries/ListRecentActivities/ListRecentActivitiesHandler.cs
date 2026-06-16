using Crm.Application.Features.Dashboard.Dtos;
using Crm.Application.Interfaces;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Dashboard.Queries.ListRecentActivities;

public sealed class ListRecentActivitiesHandler
    : IRequestHandler<ListRecentActivitiesQuery, Result<PagedResult<ActivityDigestItem>>>
{
    private readonly ICrmDbContext _db;
    private readonly IContextUser _contextUser;

    public ListRecentActivitiesHandler(ICrmDbContext db, IContextUser contextUser)
    {
        _db = db;
        _contextUser = contextUser;
    }

    public async Task<Result<PagedResult<ActivityDigestItem>>> Handle(ListRecentActivitiesQuery request, CancellationToken cancellationToken)
    {
        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var skip = Math.Max(pageNumber - 1, 0) * pageSize;

        var query = _db.Activity.AsNoTracking();

        if (request.OwnerOnly)
            query = query.Where(a => a.OwnerId == _contextUser.UserId);

        var entities = await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip(skip)
            .Take(pageSize + 1)
            .ToListAsync(cancellationToken);

        var hasMore = entities.Count > pageSize;
        if (hasMore) entities.RemoveAt(entities.Count - 1);

        var items = entities.Adapt<List<ActivityDigestItem>>();

        return new PagedResult<ActivityDigestItem>
        {
            Data = items,
            Pagination = new PaginationResponse { PageNumber = pageNumber, PageSize = pageSize, HasMoreRecord = hasMore },
        };
    }
}
