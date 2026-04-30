using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Results;
using Platform.Application.Features.AppOrganizations.Dtos;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Platform.Application.Features.AppOrganizations.Queries.GetAppOrganization;

public sealed class GetAppOrganizationHandler : IRequestHandler<GetAppOrganizationQuery, Result<AppOrganizationDetailItem>>
{
    private readonly IApplicationDbContext _db;

    public GetAppOrganizationHandler(IApplicationDbContext db) => _db = db;

    public async Task<Result<AppOrganizationDetailItem>> Handle(GetAppOrganizationQuery request, CancellationToken cancellationToken)
    {
        var entity = await _db.AppOrganization
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.Id == request.Id, cancellationToken);

        if (entity is null) return AppOrganizationErrors.NotFound;

        var dto = entity.Adapt<AppOrganizationDetailItem>();

        // Parent ve ReportsTo isimlerini ayrı sorgu ile doldur.
        if (entity.ParentOrganizationId.HasValue)
        {
            var parentName = await _db.AppOrganization.AsNoTracking()
                .Where(o => o.Id == entity.ParentOrganizationId.Value)
                .Select(o => o.OrganizationName)
                .FirstOrDefaultAsync(cancellationToken);
            dto.ParentOrganizationName = parentName;
        }

        if (entity.ReportsTo.HasValue)
        {
            var reportsToName = await _db.AppOrganization.AsNoTracking()
                .Where(o => o.Id == entity.ReportsTo.Value)
                .Select(o => o.OrganizationName)
                .FirstOrDefaultAsync(cancellationToken);
            dto.ReportsToName = reportsToName;
        }

        return dto;
    }
}
