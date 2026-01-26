using CRM.Domain.Enums;

namespace CRM.Domain.Entities.Activity;

/// <summary>
/// E-posta Aktivitesi
/// Katılımcılar (To, Cc, Bcc, From) ActivityParty tablosunda tutulur.
/// </summary>
public class EmailActivity : ActivityBase
{
    public EmailActivity() : base(ActivityType.Email)
    {
    }
       

    #region Email Properties
    /// <summary>
    /// E-posta konusu (Subject property'si ActivityBase'den geliyor)
    /// Bu alan e-posta spesifik konu için kullanılabilir
    /// </summary>
    public string? EmailSubject { get; set; }

    /// <summary>
    /// E-posta içeriği
    /// </summary>
    public string? Body { get; set; }

    /// <summary>
    /// HTML formatında mı?
    /// </summary>
    public bool IsHtml { get; set; } = true;

    /// <summary>
    /// Gönderilme tarihi
    /// </summary>
    public DateTime? SentDate { get; set; }

    /// <summary>
    /// E-posta gönderildi mi?
    /// </summary>
    public bool IsSent { get; set; }

    /// <summary>
    /// Okundu mu?
    /// </summary>
    public bool IsRead { get; set; }

    /// <summary>
    /// Okunma tarihi
    /// </summary>
    public DateTime? ReadDate { get; set; }
    #endregion

    #region Party Helper Properties
    /// <summary>
    /// Gönderen (From)
    /// </summary>
    public ActivityParty? From => Parties.FirstOrDefault(p => p.PartyType == ActivityPartyType.From);

    /// <summary>
    /// Alıcılar (To)
    /// </summary>
    public IEnumerable<ActivityParty> ToRecipients => Parties.Where(p => p.PartyType == ActivityPartyType.To);

    /// <summary>
    /// CC alıcıları
    /// </summary>
    public IEnumerable<ActivityParty> CcRecipients => Parties.Where(p => p.PartyType == ActivityPartyType.Cc);

    /// <summary>
    /// BCC alıcıları
    /// </summary>
    public IEnumerable<ActivityParty> BccRecipients => Parties.Where(p => p.PartyType == ActivityPartyType.Bcc);
    #endregion

    #region Domain Methods
    /// <summary>
    /// Gönderen ekle
    /// </summary>
    public void SetFrom(ActivityParty party)
    {
        // Mevcut From'u kaldır
        var existingFrom = Parties.FirstOrDefault(p => p.PartyType == ActivityPartyType.From);
        if (existingFrom != null)
        {
            Parties.Remove(existingFrom);
        }

        party.PartyType = ActivityPartyType.From;
        AddParty(party);
    }

    /// <summary>
    /// To alıcısı ekle
    /// </summary>
    public void AddTo(ActivityParty party)
    {
        party.PartyType = ActivityPartyType.To;
        AddParty(party);
    }

    /// <summary>
    /// CC alıcısı ekle
    /// </summary>
    public void AddCc(ActivityParty party)
    {
        party.PartyType = ActivityPartyType.Cc;
        AddParty(party);
    }

    /// <summary>
    /// BCC alıcısı ekle
    /// </summary>
    public void AddBcc(ActivityParty party)
    {
        party.PartyType = ActivityPartyType.Bcc;
        AddParty(party);
    }

    /// <summary>
    /// E-postayı gönderildi olarak işaretle
    /// </summary>
    public void MarkAsSent()
    {
        IsSent = true;
        SentDate = DateTime.UtcNow;
        Status = ActivityStatus.Completed;
        CompletedDate = DateTime.UtcNow;
    }

    /// <summary>
    /// E-postayı okundu olarak işaretle
    /// </summary>
    public void MarkAsRead()
    {
        IsRead = true;
        ReadDate = DateTime.UtcNow;
    }
    #endregion
}