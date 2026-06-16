using Crm.Application.Features.Dashboard.Dtos;
using Crm.Application.Interfaces;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Dashboard.Queries.GetSalesPipeline;

public sealed class GetSalesPipelineHandler
    : IRequestHandler<GetSalesPipelineQuery, Result<List<PipelineStageItem>>>
{
    private readonly ICrmDbContext _db;
    private readonly IContextUser _contextUser;

    public GetSalesPipelineHandler(ICrmDbContext db, IContextUser contextUser)
    {
        _db = db;
        _contextUser = contextUser;
    }

    public async Task<Result<List<PipelineStageItem>>> Handle(GetSalesPipelineQuery request, CancellationToken cancellationToken)
    {
        // Stage code'ları döner; etiket/sıralama frontend'de (enums namespace) çözülür.
        var opportunities = _db.Opportunity.AsNoTracking()
            .Where(o => o.IsActive && !DashboardConstants.ClosedStages.Contains(o.Stage));

        if (request.OwnerOnly)
            opportunities = opportunities.Where(o => o.OwnerId == _contextUser.UserId);

        var rows = await opportunities
            .GroupBy(o => o.Stage)
            .Select(g => new PipelineStageItem
            {
                Stage = g.Key,
                Count = g.LongCount(),
                TotalValue = g.Sum(x => (decimal?)x.EstimatedAmount) ?? 0m,
            })
            .ToListAsync(cancellationToken);

        return rows;
    }
}
