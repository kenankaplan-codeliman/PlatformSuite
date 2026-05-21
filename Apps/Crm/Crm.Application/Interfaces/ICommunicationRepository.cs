using Crm.Application.Common.Dtos.Communications;

namespace Crm.Application.Interfaces;

/// <summary>
/// Bir sahip entity'nin (Account/Contact/...) email/telefon/adres koleksiyonlarını,
/// polimorfik owner (ParentEntityType + ParentEntityId) üzerinden yükler ve senkronlar.
/// Email/Phone/Address artık aggregate navigation olmadığı için command handler'ları
/// parent kaydı sakladıktan sonra <see cref="SyncAsync"/> çağırır.
/// </summary>
public interface ICommunicationRepository
{
    /// <summary>
    /// Verilen parent için gelen DTO listeleriyle email/phone/address kayıtlarını
    /// merge eder (yeni ekler, var olanı günceller, listede olmayanı soft-delete eder) ve kaydeder.
    /// </summary>
    Task SyncAsync(
        string parentEntityType,
        Guid parentEntityId,
        IReadOnlyList<EmailModal> emails,
        IReadOnlyList<PhoneModal> phones,
        IReadOnlyList<AddressModal> addresses,
        CancellationToken cancellationToken = default);
}
