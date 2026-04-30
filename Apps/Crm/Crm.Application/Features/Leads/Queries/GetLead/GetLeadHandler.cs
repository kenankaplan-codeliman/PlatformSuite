using Crm.Application.Features.Leads.Dtos;
using Crm.Application.Interfaces;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Leads.Queries.GetLead;

public sealed class GetLeadHandler : IRequestHandler<GetLeadQuery, Result<LeadDetailItem>>
{
    private readonly ICrmDbContext _db;

    public GetLeadHandler(ICrmDbContext db) => _db = db;

    public async Task<Result<LeadDetailItem>> Handle(GetLeadQuery request, CancellationToken cancellationToken)
    {
        var entity = await _db.Lead
            .AsNoTracking()
            .Include(l => l.ConvertedAccount)
            .Include(l => l.ConvertedContact)
            .FirstOrDefaultAsync(l => l.Id == request.Id, cancellationToken);

        if (entity is null) return LeadErrors.NotFound;

        return entity.Adapt<LeadDetailItem>();
    }
}
