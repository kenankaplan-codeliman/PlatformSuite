using CRM.Domain.Entities.Common;
using CRM.Domain.Enums;

namespace CRM.Domain.Entities.Activities;

/// <summary>
/// Aktivite Katılımcısı
/// Bir aktiviteye katılan kişileri (kullanıcı, müşteri, kontak, harici) temsil eder.
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

    #region Participant Type & Reference
    /// <summary>
    /// Katılımcı tipi (User, Account, Contact, Lead, External)
    /// </summary>
    public ActivityParticipantType ParticipantType { get; set; }

    /// <summary>
    /// Katılımcı ID (User, Account, Contact, Lead için)
    /// External tip için null olabilir
    /// </summary>
    public Guid? ParticipantId { get; set; }
    #endregion

    #region External Participant Info
    /// <summary>
    /// Harici katılımcı adı (ParticipantType = External ise)
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
    public string DisplayName => ParticipantType == ActivityParticipantType.External
        ? Name ?? Email ?? PhoneNumber ?? "Unknown"
        : $"{ParticipantType}:{ParticipantId}";

    /// <summary>
    /// Harici katılımcı mı?
    /// </summary>
    public bool IsExternal => ParticipantType == ActivityParticipantType.External;
    #endregion

    #region Factory Methods
    /// <summary>
    /// Sistem kullanıcısı için ActivityParty oluştur
    /// </summary>
    public static ActivityParty ForUser(Guid activityId, Guid userId, ActivityPartyType partyType)
    {
        return new ActivityParty
        {
            ActivityId = activityId,
            PartyType = partyType,
            ParticipantType = ActivityParticipantType.User,
            ParticipantId = userId
        };
    }

    /// <summary>
    /// Account için ActivityParty oluştur
    /// </summary>
    public static ActivityParty ForAccount(Guid activityId, Guid accountId, ActivityPartyType partyType)
    {
        return new ActivityParty
        {
            ActivityId = activityId,
            PartyType = partyType,
            ParticipantType = ActivityParticipantType.Account,
            ParticipantId = accountId
        };
    }

    /// <summary>
    /// Contact için ActivityParty oluştur
    /// </summary>
    public static ActivityParty ForContact(Guid activityId, Guid contactId, ActivityPartyType partyType)
    {
        return new ActivityParty
        {
            ActivityId = activityId,
            PartyType = partyType,
            ParticipantType = ActivityParticipantType.Contact,
            ParticipantId = contactId
        };
    }

    /// <summary>
    /// Lead için ActivityParty oluştur
    /// </summary>
    public static ActivityParty ForLead(Guid activityId, Guid leadId, ActivityPartyType partyType)
    {
        return new ActivityParty
        {
            ActivityId = activityId,
            PartyType = partyType,
            ParticipantType = ActivityParticipantType.Lead,
            ParticipantId = leadId
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
            ParticipantType = ActivityParticipantType.External,
            Email = email,
            Name = name
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
            ParticipantType = ActivityParticipantType.External,
            PhoneNumber = phoneNumber,
            Name = name
        };
    }
    #endregion
}