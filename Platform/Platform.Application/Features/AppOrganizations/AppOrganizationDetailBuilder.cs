using Platform.Application.Common.Abstractions;
using Platform.Application.Features.AppOrganizations.Dtos;
using Platform.Application.Modals.Common;
using Platform.Domain.Enums;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Platform.Application.Features.AppOrganizations;

/// <summary>
/// Save sonrası fresh DTO üretimi için ortak helper. AppOrganization entity'sinde
/// Parent/ReportsTo navigation property bulunmadığı için EntityReference projection'ı
/// burada ayrı sorguyla doldurulur — Get / Create / Update aynı çıktıyı garanti eder.
/// </summary>
internal static class AppOrganizationDetailBuilder
{
    public static async Task<AppOrganizationDetailItem?> BuildAsync(
        IApplicationDbContext db, Guid id, CancellationToken cancellationToken)
    {
        var entity = await db.AppOrganization
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);

        if (entity is null) return null;

        var dto = entity.Adapt<AppOrganizationDetailItem>();

        if (entity.ParentOrganizationId.HasValue)
        {
            dto.ParentOrganization = await db.AppOrganization.AsNoTracking()
                .Where(o => o.Id == entity.ParentOrganizationId.Value)
                .Select(o => new EntityReference(EntityType.None)
                {
                    Id = o.Id,
                    Name = o.Title ?? o.OrganizationName,
                })
                .FirstOrDefaultAsync(cancellationToken);
        }

        if (entity.ReportsTo.HasValue)
        {
            dto.ReportsTo = await db.AppOrganization.AsNoTracking()
                .Where(o => o.Id == entity.ReportsTo.Value)
                .Select(o => new EntityReference(EntityType.None)
                {
                    Id = o.Id,
                    Name = o.Title ?? o.OrganizationName,
                })
                .FirstOrDefaultAsync(cancellationToken);
        }

        return dto;
    }
}
