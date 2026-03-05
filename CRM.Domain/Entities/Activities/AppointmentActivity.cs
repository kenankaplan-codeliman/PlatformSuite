using CRM.Domain.Enums;

namespace CRM.Domain.Entities.Activities;

/// <summary>
/// Randevu / Toplantı Aktivitesi
/// Katılımcılar (Organizer, Attendees) ActivityParty tablosunda tutulur.
/// </summary>
public class AppointmentActivity : ActivityBase
{
    public AppointmentActivity() : base(ActivityType.Appointment)
    {
    }

    #region Appointment Properties
    /// <summary>
    /// Toplantı lokasyonu
    /// </summary>
    public string? Location { get; set; }

    /// <summary>
    /// Online toplantı mı?
    /// </summary>
    public bool IsOnline { get; set; }

    /// <summary>
    /// Online toplantı linki (Zoom, Teams, Meet vb.)
    /// </summary>
    public string? MeetingUrl { get; set; }

    /// <summary>
    /// Tüm gün etkinliği mi?
    /// </summary>
    public bool IsAllDay { get; set; }

    /// <summary>
    /// Hatırlatıcı süresi (dakika olarak, toplantıdan önce)
    /// </summary>
    public int? ReminderMinutesBefore { get; set; }

    /// <summary>
    /// Tekrarlama kuralı (iCal RRULE formatında)
    /// </summary>
    public string? RecurrenceRule { get; set; }

    /// <summary>
    /// Tekrarlayan mı?
    /// </summary>
    public bool IsRecurring { get; set; }

    /// <summary>
    /// Ana tekrarlayan randevu ID'si (eğer bu bir instance ise)
    /// </summary>
    public Guid? RecurringParentId { get; set; }

    /// <summary>
    /// Toplantı notları
    /// </summary>
    public string? MeetingNotes { get; set; }
    #endregion

    #region Party Helper Properties
    /// <summary>
    /// Organizatör
    /// </summary>
    public ActivityParty? Organizer => Parties.FirstOrDefault(p => p.PartyType == ActivityPartyType.Organizer);

    /// <summary>
    /// Tüm katılımcılar (Attendee, Required, Optional)
    /// </summary>
    public IEnumerable<ActivityParty> Attendees => Parties.Where(p =>
        p.PartyType == ActivityPartyType.Attendee ||
        p.PartyType == ActivityPartyType.Required ||
        p.PartyType == ActivityPartyType.Optional);

    /// <summary>
    /// Zorunlu katılımcılar
    /// </summary>
    public IEnumerable<ActivityParty> RequiredAttendees => Parties.Where(p => p.PartyType == ActivityPartyType.Required);

    /// <summary>
    /// Opsiyonel katılımcılar
    /// </summary>
    public IEnumerable<ActivityParty> OptionalAttendees => Parties.Where(p => p.PartyType == ActivityPartyType.Optional);
    #endregion

    #region Domain Methods
    /// <summary>
    /// Organizatör ayarla
    /// </summary>
    public void SetOrganizer(ActivityParty party)
    {
        // Mevcut organizatörü kaldır
        var existingOrganizer = Parties.FirstOrDefault(p => p.PartyType == ActivityPartyType.Organizer);
        if (existingOrganizer != null)
        {
            Parties.Remove(existingOrganizer);
        }

        party.PartyType = ActivityPartyType.Organizer;
        AddParty(party);
    }

    /// <summary>
    /// Zorunlu katılımcı ekle
    /// </summary>
    public void AddRequiredAttendee(ActivityParty party)
    {
        party.PartyType = ActivityPartyType.Required;
        AddParty(party);
    }

    /// <summary>
    /// Opsiyonel katılımcı ekle
    /// </summary>
    public void AddOptionalAttendee(ActivityParty party)
    {
        party.PartyType = ActivityPartyType.Optional;
        AddParty(party);
    }

    /// <summary>
    /// Katılımcı ekle (genel)
    /// </summary>
    public void AddAttendee(ActivityParty party)
    {
        party.PartyType = ActivityPartyType.Attendee;
        AddParty(party);
    }

    #endregion
}