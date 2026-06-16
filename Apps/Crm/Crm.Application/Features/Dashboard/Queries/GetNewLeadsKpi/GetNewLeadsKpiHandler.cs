using Crm.Application.Features.Dashboard.Dtos;
using Crm.Application.Interfaces;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Dashboard.Queries.GetNewLeadsKpi;

public sealed class GetNewLeadsKpiHandler
    : IRequestHandler<GetNewLeadsKpiQuery, Result<KpiCountItem>>
{
    private readonly ICrmDbContext _db;
    private readonly IContextUser _contextUser;

    public GetNewLeadsKpiHandler(ICrmDbContext db, IContextUser contextUser)
    {
        _db = db;
        _contextUser = contextUser;
    }

    public async Task<Result<KpiCountItem>> Handle(GetNewLeadsKpiQuery request, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        var query = _db.Lead.AsNoTracking().Where(l => l.CreatedAt >= monthStart);

        if (request.OwnerOnly)
            query = query.Where(l => l.OwnerId == _contextUser.UserId);

        var count = await query.LongCountAsync(cancellationToken);

        return new KpiCountItem { Count = count };
    }
}
