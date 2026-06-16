using Crm.Application.Features.Dashboard.Dtos;
using Crm.Application.Interfaces;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Platform.Domain.Enums;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Dashboard.Queries.ListMyTasks;

public sealed class ListMyTasksHandler
    : IRequestHandler<ListMyTasksQuery, Result<PagedResult<ActivityDigestItem>>>
{
    private readonly ICrmDbContext _db;
    private readonly IContextUser _contextUser;

    public ListMyTasksHandler(ICrmDbContext db, IContextUser contextUser)
    {
        _db = db;
        _contextUser = contextUser;
    }

    public async Task<Result<PagedResult<ActivityDigestItem>>> Handle(ListMyTasksQuery request, CancellationToken cancellationToken)
    {
        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var skip = Math.Max(pageNumber - 1, 0) * pageSize;

        var query = _db.Activity.AsNoTracking()
            .Where(a => (a.ActivityType == ActivityType.Task || a.ActivityType == ActivityType.Appointment)
                        && a.Status != ActivityStatus.Completed && a.Status != ActivityStatus.Cancelled);

        if (request.OwnerOnly)
            query = query.Where(a => a.OwnerId == _contextUser.UserId);

        // Tarihsiz görevler en sona; tarihliler en yakın due önce.
        var entities = await query
            .OrderBy(a => a.DueDate == null)
            .ThenBy(a => a.DueDate)
            .Skip(skip)
            .Take(pageSize + 1)
            .ToListAsync(cancellationToken);

        var hasMore = entities.Count > pageSize;
        if (hasMore) entities.RemoveAt(entities.Count - 1);

        // Enum→string map için materialize sonrası Adapt (EnumToStringConverter EF projeksiyonunu zorlaştırır).
        var items = entities.Adapt<List<ActivityDigestItem>>();

        return new PagedResult<ActivityDigestItem>
        {
            Data = items,
            Pagination = new PaginationResponse { PageNumber = pageNumber, PageSize = pageSize, HasMoreRecord = hasMore },
        };
    }
}
