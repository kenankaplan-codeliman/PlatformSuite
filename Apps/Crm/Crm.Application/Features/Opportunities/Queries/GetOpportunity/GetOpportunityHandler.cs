using Crm.Application.Features.Opportunities.Dtos;
using Crm.Application.Interfaces;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Opportunities.Queries.GetOpportunity;

public sealed class GetOpportunityHandler : IRequestHandler<GetOpportunityQuery, Result<OpportunityDetailItem>>
{
    private readonly ICrmDbContext _db;

    public GetOpportunityHandler(ICrmDbContext db) => _db = db;

    public async Task<Result<OpportunityDetailItem>> Handle(GetOpportunityQuery request, CancellationToken cancellationToken)
    {
        var entity = await _db.Opportunity
            .AsNoTracking()
            .Include(o => o.Account)
            .Include(o => o.PrimaryContact)
            .FirstOrDefaultAsync(o => o.Id == request.Id, cancellationToken);

        if (entity is null) return OpportunityErrors.NotFound;

        return entity.Adapt<OpportunityDetailItem>();
    }
}
