using CRM.Domain.Enums;

namespace CRM.Domain.Entities.Activity;

/// <summary>
/// Telefon Görüşmesi Aktivitesi
/// Katılımcılar (Caller, Recipient) ActivityParty tablosunda tutulur.
/// </summary>
public class PhoneCall : ActivityBase
{
    public PhoneCall() : base(ActivityType.PhoneCall)
    {
    }

    #region Phone Call Properties
    /// <summary>
    /// Arama yönü (Gelen / Giden)
    /// </summary>
    public Direction CallDirection { get; set; }

    /// <summary>
    /// Telefon numarası (hızlı erişim için - ayrıca Party'de de tutulabilir)
    /// </summary>
    public string? PhoneNumber { get; set; }

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
        StartDate = DateTime.UtcNow;
        Status = ActivityStatus.InProgress;
    }

    /// <summary>
    /// Görüşmeyi bitir
    /// </summary>
    public void EndCall(string? result = null)
    {
        CallResult = result;
        Completed();
    }

    #endregion
}