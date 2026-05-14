using Platform.Domain.Enums;

namespace Platform.Application.Common.Numbering;

/// <summary>
/// Bir doküman tipinin numara formatını ve sıfırlama periyodunu tanımlar.
/// Her doküman tipi kendi strategy sınıfında izole edilir (Open/Closed Principle).
/// Strategy'ler stateless olmalıdır — singleton lifecycle ile kayıt edilir.
///
/// Her uygulama (CRM, CodePro vb.) kendi doküman tipleri için strategy yazar ve
/// DI'a kaydeder; <see cref="INumberFormatStrategyResolver"/> registry üzerinden
/// ilgili strategy'ye delegasyon yapar.
/// </summary>
public interface INumberFormatStrategy
{
    /// <summary>Doküman tipi anahtarı (örn. "PURCHASE_ORDER"). Case-insensitive eşlenir.</summary>
    string DocumentType { get; }

    /// <summary>Bu doküman tipinin sayacının hangi periyotta sıfırlanacağı.</summary>
    CounterResetPeriod ResetPeriod { get; }

    /// <summary>Sıra numarasını okunabilir doküman numarasına çevirir.</summary>
    string Format(NumberFormatContext context);
}
