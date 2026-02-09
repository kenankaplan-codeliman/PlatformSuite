using System.Text.Json.Serialization;

namespace CRM.Domain.Enums;

/// <summary>
/// Aktivite katılımcısının tipi (kim olduğu)
/// </summary>

public enum ActivityParticipantType
{
    /// <summary>
    /// Sistem kullanıcısı
    /// </summary>
    User,

    /// <summary>
    /// Müşteri (Account)
    /// </summary>
    Account,

    /// <summary>
    /// Kontak kişi
    /// </summary>
    Contact,

    /// <summary>
    /// Lead
    /// </summary>
    Lead,

    /// <summary>
    /// Harici katılımcı (sistemde kaydı yok)
    /// </summary>
    External
}