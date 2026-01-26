namespace CRM.Domain.Enums;

/// <summary>
/// Aktivite katılımcısının tipi (kim olduğu)
/// </summary>
public enum ActivityParticipantType
{
    /// <summary>
    /// Sistem kullanıcısı
    /// </summary>
    User = 0,

    /// <summary>
    /// Müşteri (Account)
    /// </summary>
    Account = 1,

    /// <summary>
    /// Kontak kişi
    /// </summary>
    Contact = 2,

    /// <summary>
    /// Lead
    /// </summary>
    Lead = 3,

    /// <summary>
    /// Harici katılımcı (sistemde kaydı yok)
    /// </summary>
    External = 4
}