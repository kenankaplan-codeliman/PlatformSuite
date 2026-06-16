using Crm.Application.Features.Dashboard.Dtos;
using Crm.Application.Interfaces;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Dashboard.Queries.GetWonThisMonthKpi;

public sealed class GetWonThisMonthKpiHandler
    : IRequestHandler<GetWonThisMonthKpiQuery, Result<KpiValueItem>>
{
    private readonly ICrmDbContext _db;
    private readonly IContextUser _contextUser;

    public GetWonThisMonthKpiHandler(ICrmDbContext db, IContextUser contextUser)
    {
        _db = db;
        _contextUser = contextUser;
    }

    public async Task<Result<KpiValueItem>> Handle(GetWonThisMonthKpiQuery request, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var nextMonth = monthStart.AddMonths(1);

        var query = _db.Opportunity.AsNoTracking()
            .Where(o => o.Stage == DashboardConstants.StageClosedWon
                        && o.CloseDate >= monthStart && o.CloseDate < nextMonth);

        if (request.OwnerOnly)
            query = query.Where(o => o.OwnerId == _contextUser.UserId);

        return new KpiValueItem
        {
            Count = await query.LongCountAsync(cancellationToken),
            // Kazanılan değer: gerçekleşen tutar, yoksa tahmini.
            TotalValue = await query.SumAsync(o => (decimal?)(o.ActualAmount ?? o.EstimatedAmount), cancellationToken) ?? 0m,
        };
    }
}
