using Crm.Application.Features.Dashboard.Dtos;
using Crm.Application.Interfaces;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Dashboard.Queries.GetOpenOpportunitiesKpi;

public sealed class GetOpenOpportunitiesKpiHandler
    : IRequestHandler<GetOpenOpportunitiesKpiQuery, Result<KpiValueItem>>
{
    private readonly ICrmDbContext _db;
    private readonly IContextUser _contextUser;

    public GetOpenOpportunitiesKpiHandler(ICrmDbContext db, IContextUser contextUser)
    {
        _db = db;
        _contextUser = contextUser;
    }

    public async Task<Result<KpiValueItem>> Handle(GetOpenOpportunitiesKpiQuery request, CancellationToken cancellationToken)
    {
        // Global owner/soft-delete filtreleri otomatik uygulanır; sadece açık aşamalar.
        var query = _db.Opportunity.AsNoTracking()
            .Where(o => o.IsActive && !DashboardConstants.ClosedStages.Contains(o.Stage));

        if (request.OwnerOnly)
            query = query.Where(o => o.OwnerId == _contextUser.UserId);

        return new KpiValueItem
        {
            Count = await query.LongCountAsync(cancellationToken),
            TotalValue = await query.SumAsync(o => (decimal?)o.EstimatedAmount, cancellationToken) ?? 0m,
        };
    }
}
