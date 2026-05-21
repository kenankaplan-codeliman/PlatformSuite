using Crm.Application.Common.Dtos.Communications;
using Crm.Application.Interfaces;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Common.Communications;

/// <summary>
/// Detail DTO'larının email/telefon/adres koleksiyonlarını polimorfik owner
/// (ParentEntityType + ParentEntityId) üzerinden tek noktadan yükler. Email/Phone/Address
/// artık aggregate navigation olmadığı için Get/Create/Update handler'ları bunu kullanır.
/// </summary>
public static class CommunicationQueryExtensions
{
    public static async Task<(List<EmailModal> Emails, List<PhoneModal> Phones, List<AddressModal> Addresses)>
        LoadCommunicationsAsync(
            this ICrmDbContext db,
            string parentEntityType,
            Guid parentEntityId,
            CancellationToken cancellationToken = default)
    {
        var emails = await db.EmailAddress.AsNoTracking()
            .Where(e => e.ParentEntityType == parentEntityType && e.ParentEntityId == parentEntityId)
            .OrderByDescending(e => e.IsPrimary)
            .ProjectToType<EmailModal>()
            .ToListAsync(cancellationToken);

        var phones = await db.Phone.AsNoTracking()
            .Where(p => p.ParentEntityType == parentEntityType && p.ParentEntityId == parentEntityId)
            .OrderByDescending(p => p.IsPrimary)
            .ProjectToType<PhoneModal>()
            .ToListAsync(cancellationToken);

        var addresses = await db.Address.AsNoTracking()
            .Where(a => a.ParentEntityType == parentEntityType && a.ParentEntityId == parentEntityId)
            .OrderByDescending(a => a.IsPrimary)
            .ProjectToType<AddressModal>()
            .ToListAsync(cancellationToken);

        return (emails, phones, addresses);
    }
}
