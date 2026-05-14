namespace Platform.Application.Common.Numbering;

/// <summary>
/// Doküman tipine göre ilgili <see cref="INumberFormatStrategy"/>'yi bulan registry.
/// DI'a kayıtlı tüm strategy implementasyonlarını toplar.
/// </summary>
public interface INumberFormatStrategyResolver
{
    /// <summary>
    /// Verilen doküman tipi için strategy döner. Kayıtlı strategy yoksa
    /// <see cref="InvalidOperationException"/> fırlatır (konfigürasyon hatası).
    /// </summary>
    INumberFormatStrategy Resolve(string documentType);
}
