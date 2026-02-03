using CRM.Domain.Enums;

namespace CRM.Domain.Entities.Activity;

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
    /// Başlangıç zamanı
    /// </summary>
    public DateTime StartTime { get; set; }

    /// <summary>
    /// Bitiş zamanı
    /// </summary>
    public DateTime EndTime { get; set; }

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

    #region Computed Properties
    /// <summary>
    /// Toplantı süresi
    /// </summary>
    public TimeSpan AppointmentDuration => EndTime - StartTime;
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

    /// <summary>
    /// Online toplantı olarak ayarla
    /// </summary>
    public void SetAsOnlineMeeting(string meetingUrl)
    {
        IsOnline = true;
        MeetingUrl = meetingUrl;
    }

    /// <summary>
    /// Yüz yüze toplantı olarak ayarla
    /// </summary>
    public void SetAsInPersonMeeting(string location)
    {
        IsOnline = false;
        Location = location;
        MeetingUrl = null;
    }

    /// <summary>
    /// Randevu zamanını güncelle
    /// </summary>
    public void Reschedule(DateTime newStartTime, DateTime newEndTime)
    {
        if (newEndTime <= newStartTime)
        {
            throw new ArgumentException("Bitiş zamanı başlangıç zamanından sonra olmalıdır.");
        }

        StartTime = newStartTime;
        EndTime = newEndTime;
        Duration = AppointmentDuration;
    }

    /// <summary>
    /// Randevuyu başlat
    /// </summary>
    public void StartAppointment()
    {
        Status = ActivityStatus.InProgress;
    }

    /// <summary>
    /// Randevuyu tamamla
    /// </summary>
    public override void MarkAsCompleted()
    {
        base.MarkAsCompleted();
        Duration = AppointmentDuration;
    }

    /// <summary>
    /// Hatırlatıcı ayarla
    /// </summary>
    public void SetReminder(int minutesBefore)
    {
        ReminderMinutesBefore = minutesBefore;
    }
    #endregion
}