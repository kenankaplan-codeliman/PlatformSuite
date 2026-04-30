using Platform.Domain.Enums;

namespace Platform.Domain.Entities.Activities;

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
    public Direction CallDirection { get; set; }

    /// <summary>
    /// Görüşme kaydı URL'i
    /// </summary>
    public string? RecordingUrl { get; set; }

    /// <summary>
    /// Görüşme notları
    /// </summary>
    public string? CallNotes { get; set; }

    #endregion

    #region Party Helper Properties
    /// <summary>
    /// Arayan
    /// </summary>
    public ActivityParty? Caller => Parties.FirstOrDefault(p => p.PartyType == ActivityPartyType.Caller);

    /// <summary>
    /// Aranan(lar)
    /// </summary>
    public ActivityParty? Recipient => Parties.FirstOrDefault(p => p.PartyType == ActivityPartyType.Recipient);
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
    public void SetRecipient(ActivityParty party)
    {

        var existingCaller = Parties.FirstOrDefault(p => p.PartyType == ActivityPartyType.Recipient);
        if (existingCaller != null)
        {
            Parties.Remove(existingCaller);
        }

        party.PartyType = ActivityPartyType.Recipient;
        AddParty(party);
    }

    #endregion
}