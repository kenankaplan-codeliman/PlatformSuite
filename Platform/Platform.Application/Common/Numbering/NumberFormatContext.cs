namespace Platform.Application.Common.Numbering;

/// <summary>
/// Format strategy'sine geçirilen bağlam. <paramref name="ExtraTokens"/> opsiyoneldir —
/// kanal bilgisi, şube kodu gibi domain-specific verileri taşımak için kullanılır.
/// </summary>
public record NumberFormatContext(
    string DocumentType,
    long Sequence,
    DateTime GeneratedAt,
    IReadOnlyDictionary<string, string>? ExtraTokens = null
);
