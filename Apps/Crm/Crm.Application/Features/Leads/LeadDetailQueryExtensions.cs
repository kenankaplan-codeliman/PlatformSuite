using Crm.Application.Common.Communications;
using Crm.Application.Features.Leads.Dtos;
using Crm.Application.Interfaces;
using Crm.Domain.Entities.Leads;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Leads;

/// <summary>
/// Lead detail DTO'sunu tek noktadan kurar: entity'i convert navigation'larıyla
/// yükler, Mapster ile map'ler ve email/telefon/adres koleksiyonlarını polimorfik
/// owner (parent_entity_type = "Lead") üzerinden doldurur. Create/Update/Convert
/// handler'ları kayıt sonrası bunu çağırır.
/// </summary>
public static class LeadDetailQueryExtensions
{
    public static async Task<LeadDetailItem> BuildLeadDetailAsync(
        this ICrmDbContext db,
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var saved = await db.Lead
            .AsNoTracking()
            .Include(l => l.ConvertedAccount)
            .Include(l => l.ConvertedContact)
            .FirstAsync(l => l.Id == id, cancellationToken);

        var dto = saved.Adapt<LeadDetailItem>();
        (dto.Emails, dto.Phones, dto.Addresses) =
            await db.LoadCommunicationsAsync(nameof(Lead), id, cancellationToken);
        return dto;
    }
}
