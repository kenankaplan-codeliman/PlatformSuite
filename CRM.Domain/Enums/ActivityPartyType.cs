namespace CRM.Domain.Enums;

/// <summary>
/// Aktivite katılımcısının rolü
/// </summary>
public enum ActivityPartyType
{
    /// <summary>
    /// Gönderen (Email için)
    /// </summary>
    From = 0,

    /// <summary>
    /// Alıcı (Email To, Appointment Attendee)
    /// </summary>
    To = 1,

    /// <summary>
    /// CC alıcısı (Email için)
    /// </summary>
    Cc = 2,

    /// <summary>
    /// BCC alıcısı (Email için)
    /// </summary>
    Bcc = 3,

    /// <summary>
    /// Organizatör (Appointment için)
    /// </summary>
    Organizer = 4,

    /// <summary>
    /// Katılımcı (Appointment için)
    /// </summary>
    Attendee = 5,

    /// <summary>
    /// Arayan (PhoneCall için)
    /// </summary>
    Caller = 6,

    /// <summary>
    /// Aranan (PhoneCall için)
    /// </summary>
    Recipient = 7,

    /// <summary>
    /// Görev sahibi (Task için)
    /// </summary>
    Owner = 8,

    /// <summary>
    /// Gerekli katılımcı
    /// </summary>
    Required = 9,

    /// <summary>
    /// Opsiyonel katılımcı
    /// </summary>
    Optional = 10
}