using Crm.Application.Features.Dashboard.Dtos;
using Crm.Application.Interfaces;
using Platform.Application.Common.Pagination;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Dashboard.Queries.ListClosingOpportunities;

public sealed class ListClosingOpportunitiesHandler
    : IRequestHandler<ListClosingOpportunitiesQuery, Result<PagedResult<OpportunityDigestItem>>>
{
    private readonly ICrmDbContext _db;
    private readonly IContextUser _contextUser;

    public ListClosingOpportunitiesHandler(ICrmDbContext db, IContextUser contextUser)
    {
        _db = db;
        _contextUser = contextUser;
    }

    public async Task<Result<PagedResult<OpportunityDigestItem>>> Handle(ListClosingOpportunitiesQuery request, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var nextMonth = monthStart.AddMonths(1);

        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;
        var skip = Math.Max(pageNumber - 1, 0) * pageSize;

        var query = _db.Opportunity.AsNoTracking()
            .Where(o => o.IsActive && !DashboardConstants.ClosedStages.Contains(o.Stage)
                        && o.CloseDate >= monthStart && o.CloseDate < nextMonth);

        if (request.OwnerOnly)
            query = query.Where(o => o.OwnerId == _contextUser.UserId);

        var items = await query
            .OrderBy(o => o.CloseDate)
            .Skip(skip)
            .Take(pageSize + 1)
            .ProjectToType<OpportunityDigestItem>()
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > pageSize;
        if (hasMore) items.RemoveAt(items.Count - 1);

        return new PagedResult<OpportunityDigestItem>
        {
            Data = items,
            Pagination = new PaginationResponse { PageNumber = pageNumber, PageSize = pageSize, HasMoreRecord = hasMore },
        };
    }
}
