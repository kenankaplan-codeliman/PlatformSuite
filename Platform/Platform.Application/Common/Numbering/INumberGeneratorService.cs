namespace Platform.Application.Common.Numbering;

/// <summary>
/// Gapless (boşluksuz), concurrency-safe doküman numarası üreticisi.
///
/// <para>
/// <b>Transaction davranışı — KRİTİK:</b> Servis kendi transaction'ını AÇMAZ.
/// Çağıranın (command handler'ın) transaction'ını kullanır. PlatformSuite'te
/// <c>TransactionBehavior</c> her <c>ICommand</c> handler'ını bir transaction ile
/// sardığı için, bu servis bir command handler içinden çağrıldığında zaten
/// ambient transaction içindedir. İş transaction'ı rollback olursa sayaç da
/// geri gelir — gap oluşmaz.
/// </para>
/// </summary>
public interface INumberGeneratorService
{
    /// <summary>
    /// Verilen doküman tipi için bir sonraki numarayı üretir (örn. "PO-2026-0001").
    /// </summary>
    /// <param name="documentType">Doküman tipi anahtarı (case-insensitive).</param>
    /// <param name="extraTokens">Format strategy'sine geçirilecek opsiyonel ek token'lar.</param>
    Task<string> GenerateAsync(
        string documentType,
        IReadOnlyDictionary<string, string>? extraTokens = null,
        CancellationToken ct = default);
}
