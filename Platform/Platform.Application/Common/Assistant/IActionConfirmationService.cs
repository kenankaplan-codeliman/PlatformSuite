namespace Platform.Application.Common.Assistant;

/// <summary>
/// Yazma araçları için onay talebini imzalı bir token'a çevirir ve doğrular. Token, çalıştırılacak
/// aracın adını + argümanlarını + kullanıcıyı + (varsa) eki + son kullanma süresini bağlar; böylece
/// onay sonrası çalıştırma, modelin yeniden kararına değil, kullanıcının onayladığı tam yüke bağlıdır.
/// </summary>
public interface IActionConfirmationService
{
    string Issue(PendingActionPayload payload);

    /// <summary>Token geçerli/değişmemiş/süresi dolmamış ve kullanıcı eşleşiyorsa yükü döner; aksi halde null.</summary>
    PendingActionPayload? Verify(string token, Guid currentUserId);
}

/// <summary>Onay token'ının içindeki bağlı yük.</summary>
public sealed class PendingActionPayload
{
    public string Tool { get; set; } = string.Empty;
    public string ArgumentsJson { get; set; } = "{}";
    public Guid UserId { get; set; }

    /// <summary>İşlem bir ek dosyaya bağlıysa (örn. CSV import) — onay anında yeniden yüklenir.</summary>
    public Guid? AttachmentId { get; set; }

    public long ExpiresAtUnix { get; set; }
}
