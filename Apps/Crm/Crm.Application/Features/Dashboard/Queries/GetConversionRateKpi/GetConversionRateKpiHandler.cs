using Crm.Application.Features.Dashboard.Dtos;
using Crm.Application.Interfaces;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Dashboard.Queries.GetConversionRateKpi;

public sealed class GetConversionRateKpiHandler
    : IRequestHandler<GetConversionRateKpiQuery, Result<ConversionRateItem>>
{
    private readonly ICrmDbContext _db;
    private readonly IContextUser _contextUser;

    public GetConversionRateKpiHandler(ICrmDbContext db, IContextUser contextUser)
    {
        _db = db;
        _contextUser = contextUser;
    }

    public async Task<Result<ConversionRateItem>> Handle(GetConversionRateKpiQuery request, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        var monthLeads = _db.Lead.AsNoTracking().Where(l => l.CreatedAt >= monthStart);

        if (request.OwnerOnly)
            monthLeads = monthLeads.Where(l => l.OwnerId == _contextUser.UserId);

        var total = await monthLeads.LongCountAsync(cancellationToken);
        var converted = await monthLeads.Where(l => l.ConvertedAt != null).LongCountAsync(cancellationToken);

        return new ConversionRateItem
        {
            TotalCount = total,
            ConvertedCount = converted,
            Rate = total == 0 ? 0m : Math.Round(converted * 100m / total, 1, MidpointRounding.AwayFromZero),
        };
    }
}
