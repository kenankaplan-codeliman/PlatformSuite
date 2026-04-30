namespace Platform.Domain.Enums;

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
    /// Harici katılımcı (sistemde kaydı yok)
    /// </summary>
    External
}
