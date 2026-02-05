using CRM.Domain.Enums;

namespace CRM.Domain.Entities.Activity;

/// <summary>
/// Telefon Görüşmesi Aktivitesi
/// Katılımcılar (Caller, Recipient) ActivityParty tablosunda tutulur.
/// </summary>
public class PhoneCallActivity : ActivityBase
{
    public PhoneCallActivity() : base(ActivityType.PhoneCall)
    {
    }

    #region Phone Call Properties
    /// <summary>
    /// Arama yönü (Gelen / Giden)
    /// </summary>
    public CallDirection CallDirection { get; set; }

    /// <summary>
    /// Telefon numarası (hızlı erişim için - ayrıca Party'de de tutulabilir)
    /// </summary>
    public string? PhoneNumber { get; set; }

    /// <summary>
    /// Görüşme başlangıç zamanı
    /// </summary>
    public virtual DateTime? StartedAt { get { 
            return base.StartDate;
        } 
        set {
            base.StartDate = value;
        } 
    }

    /// <summary>
    /// Görüşme bitiş zamanı
    /// </summary>
    public virtual DateTime? EndedAt { 
        get {
            return base.CompletedDate;
        } 
        set {
            base.CompletedDate = value; 
        } 
    }

    /// <summary>
    /// Görüşme kaydı URL'i
    /// </summary>
    public string? RecordingUrl { get; set; }

    /// <summary>
    /// Görüşme notları
    /// </summary>
    public string? CallNotes { get; set; }

    /// <summary>
    /// Arama sonucu (Cevaplandı, Meşgul, Cevapsız vb.)
    /// </summary>
    public string? CallResult { get; set; }
    #endregion

    #region Computed Properties
    /// <summary>
    /// Görüşme süresi (EndedAt - StartedAt)
    /// </summary>
    public TimeSpan? CallDuration
    {
        get
        {
            if (StartedAt.HasValue && EndedAt.HasValue)
            {
                return EndedAt.Value - StartedAt.Value;
            }
            return null;
        }
    }
    #endregion

    #region Party Helper Properties
    /// <summary>
    /// Arayan
    /// </summary>
    public ActivityParty? Caller => Parties.FirstOrDefault(p => p.PartyType == ActivityPartyType.Caller);

    /// <summary>
    /// Aranan(lar)
    /// </summary>
    public IEnumerable<ActivityParty> Recipients => Parties.Where(p => p.PartyType == ActivityPartyType.Recipient);
    #endregion

    #region Domain Methods
    /// <summary>
    /// Arayan ayarla
    /// </summary>
    public void SetCaller(ActivityParty party)
    {
        // Mevcut Caller'ı kaldır
        var existingCaller = Parties.FirstOrDefault(p => p.PartyType == ActivityPartyType.Caller);
        if (existingCaller != null)
        {
            Parties.Remove(existingCaller);
        }

        party.PartyType = ActivityPartyType.Caller;
        AddParty(party);
    }

    /// <summary>
    /// Aranan ekle
    /// </summary>
    public void AddRecipient(ActivityParty party)
    {
        party.PartyType = ActivityPartyType.Recipient;
        AddParty(party);
    }

    /// <summary>
    /// Görüşmeyi başlat
    /// </summary>
    public void StartCall()
    {
        StartedAt = DateTime.UtcNow;
        Status = ActivityStatus.InProgress;
    }

    /// <summary>
    /// Görüşmeyi bitir
    /// </summary>
    public void EndCall(string? result = null)
    {
        EndedAt = DateTime.UtcNow;
        CallResult = result;
        Duration = CallDuration;
        MarkAsCompleted();
    }

    /// <summary>
    /// Aktiviteyi tamamlandı olarak işaretle ve süreyi hesapla
    /// </summary>
    public override void MarkAsCompleted()
    {
        base.MarkAsCompleted();

        // Süreyi güncelle
        if (Duration == null && CallDuration.HasValue)
        {
            Duration = CallDuration;
        }
    }
    #endregion
}