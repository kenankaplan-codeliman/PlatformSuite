using System.Text.Json.Serialization;

namespace CRM.Domain.Enums;

/// <summary>
/// Aktivite katılımcısının rolü
/// </summary>
public enum ActivityPartyType
{
    /// <summary>
    /// Gönderen (Email için)
    /// </summary>
    From,

    /// <summary>
    /// Alıcı (Email To, Appointment Attendee)
    /// </summary>
    To,

    /// <summary>
    /// CC alıcısı (Email için)
    /// </summary>
    Cc,

    /// <summary>
    /// BCC alıcısı (Email için)
    /// </summary>
    Bcc,

    /// <summary>
    /// Organizatör (Appointment için)
    /// </summary>
    Organizer,

    /// <summary>
    /// Katılımcı (Appointment için)
    /// </summary>
    Attendee,

    /// <summary>
    /// Arayan (PhoneCall için)
    /// </summary>
    Caller,

    /// <summary>
    /// Aranan (PhoneCall için)
    /// </summary>
    Recipient,

    /// <summary>
    /// Görev sahibi (Task için)
    /// </summary>
    Owner,

    /// <summary>
    /// Gerekli katılımcı
    /// </summary>
    Required,

    /// <summary>
    /// Opsiyonel katılımcı
    /// </summary>
    Optional
}