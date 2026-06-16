using Crm.Application.Features.Dashboard.Dtos;
using Crm.Application.Interfaces;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Dashboard.Queries.GetWonLostSummary;

public sealed class GetWonLostSummaryHandler
    : IRequestHandler<GetWonLostSummaryQuery, Result<WonLostItem>>
{
    private readonly ICrmDbContext _db;
    private readonly IContextUser _contextUser;

    public GetWonLostSummaryHandler(ICrmDbContext db, IContextUser contextUser)
    {
        _db = db;
        _contextUser = contextUser;
    }

    public async Task<Result<WonLostItem>> Handle(GetWonLostSummaryQuery request, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var nextMonth = monthStart.AddMonths(1);

        var closed = _db.Opportunity.AsNoTracking()
            .Where(o => o.CloseDate >= monthStart && o.CloseDate < nextMonth
                        && (o.Stage == DashboardConstants.StageClosedWon || o.Stage == DashboardConstants.StageClosedLost));

        if (request.OwnerOnly)
            closed = closed.Where(o => o.OwnerId == _contextUser.UserId);

        var won = closed.Where(o => o.Stage == DashboardConstants.StageClosedWon);
        var lost = closed.Where(o => o.Stage == DashboardConstants.StageClosedLost);

        return new WonLostItem
        {
            WonCount = await won.LongCountAsync(cancellationToken),
            WonValue = await won.SumAsync(o => (decimal?)(o.ActualAmount ?? o.EstimatedAmount), cancellationToken) ?? 0m,
            LostCount = await lost.LongCountAsync(cancellationToken),
            LostValue = await lost.SumAsync(o => (decimal?)o.EstimatedAmount, cancellationToken) ?? 0m,
        };
    }
}
