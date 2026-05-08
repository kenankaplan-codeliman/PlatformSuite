using Platform.Domain.Entities.Common;
using Platform.Domain.Enums;

namespace Platform.Domain.Entities.Activities;

/// <summary>
/// Aktivite Katılımcısı
/// Bir aktiviteye katılan kayıtlı entity'leri (User, Account, Contact, Lead, Supplier, ...)
/// veya harici (sistemde kaydı olmayan) kişileri temsil eder.
///
/// Polimorfik referans: <see cref="ParticipantEntityType"/> (string) +
/// <see cref="ParticipantEntityId"/> (Guid?) — RegardingEntityType pattern'iyle birebir.
/// String anahtar sayesinde her uygulama (CRM, CodePro) kendi entity'lerini party olarak
/// kullanabilir; domain'e dokunmadan yeni katılımcı türleri eklenir.
///
/// Harici (External) katılımcı: <see cref="ParticipantEntityType"/> null bırakılır,
/// sadece <see cref="Name"/> / <see cref="Email"/> / <see cref="PhoneNumber"/> doldurulur.
/// </summary>
public class ActivityParty : IBaseEntity
{
    #region IBaseEntity
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;
    #endregion

    #region Relationships
    /// <summary>
    /// İlişkili aktivite ID
    /// </summary>
    public Guid ActivityId { get; set; }
    #endregion

    #region Party Type (Rol)
    /// <summary>
    /// Katılımcının aktivitedeki rolü (From, To, Cc, Attendee, Organizer vb.)
    /// </summary>
    public ActivityPartyType PartyType { get; set; }
    #endregion

    #region Polymorphic Participant Reference
    /// <summary>
    /// Katılımcı entity türü (User, Account, Contact, Lead, Supplier, ...).
    /// Null bırakılırsa harici (External) katılımcı; <see cref="Name"/>/<see cref="Email"/>/<see cref="PhoneNumber"/>
    /// alanları kullanılır.
    /// </summary>
    public string? ParticipantEntityType { get; set; }

    /// <summary>
    /// Katılımcı entity ID (User/Account/Contact/Lead/Supplier vb. için).
    /// External katılımcı için null.
    /// </summary>
    public Guid? ParticipantEntityId { get; set; }
    #endregion

    #region External Participant Info
    /// <summary>
    /// Harici katılımcı adı (ParticipantEntityType null ise)
    /// </summary>
    public string? Name { get; set; }

    /// <summary>
    /// Harici katılımcı e-posta adresi
    /// </summary>
    public string? Email { get; set; }

    /// <summary>
    /// Harici katılımcı telefon numarası
    /// </summary>
    public string? PhoneNumber { get; set; }
    #endregion

    #region Additional Info
    /// <summary>
    /// Sıralama (örn: birden fazla To varsa sıralama)
    /// </summary>
    public int SortOrder { get; set; } = 0;

    /// <summary>
    /// Katılım durumu (Appointment için: Kabul edildi, Reddedildi, vb.)
    /// </summary>
    public string? ResponseStatus { get; set; }

    /// <summary>
    /// Katılım cevap tarihi
    /// </summary>
    public DateTime? RespondedAt { get; set; }
    #endregion

    #region Computed Properties
    /// <summary>
    /// Görüntülenecek ad (sistemdeki kayıtlar için ayrıca resolve edilmeli)
    /// </summary>
    public string DisplayName => IsExternal
        ? Name ?? Email ?? PhoneNumber ?? "Unknown"
        : $"{ParticipantEntityType}:{ParticipantEntityId}";

    /// <summary>
    /// Harici katılımcı mı?
    /// </summary>
    public bool IsExternal =>
        string.IsNullOrEmpty(ParticipantEntityType) || ParticipantEntityId is null;
    #endregion

    #region Factory Methods
    /// <summary>
    /// Sistemdeki bir entity için ActivityParty üretir (User, Account, Contact, Lead, Supplier, ...).
    /// </summary>
    public static ActivityParty ForEntity(
        Guid activityId, string entityType, Guid entityId, ActivityPartyType partyType)
    {
        return new ActivityParty
        {
            ActivityId = activityId,
            PartyType = partyType,
            ParticipantEntityType = entityType,
            ParticipantEntityId = entityId,
        };
    }

    /// <summary>
    /// Harici katılımcı için ActivityParty oluştur (E-posta ile)
    /// </summary>
    public static ActivityParty ForExternalEmail(Guid activityId, string email, ActivityPartyType partyType, string? name = null)
    {
        return new ActivityParty
        {
            ActivityId = activityId,
            PartyType = partyType,
            Email = email,
            Name = name,
        };
    }

    /// <summary>
    /// Harici katılımcı için ActivityParty oluştur (Telefon ile)
    /// </summary>
    public static ActivityParty ForExternalPhone(Guid activityId, string phoneNumber, ActivityPartyType partyType, string? name = null)
    {
        return new ActivityParty
        {
            ActivityId = activityId,
            PartyType = partyType,
            PhoneNumber = phoneNumber,
            Name = name,
        };
    }
    #endregion
}
