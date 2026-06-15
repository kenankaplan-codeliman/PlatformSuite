namespace Platform.Application.Common.Assistant.Analytics;

/// <summary>
/// Entity-bağımsız analitik motoru. Entity'ler ve alanlar reflection ile keşfedilir; yeni bir
/// entity eklenince burada kod değişmez. Yalnız <c>IOwnedEntity</c> entity'leri kapsanır →
/// EF Core global query filter sayesinde satır-bazlı yetki otomatik uygulanır. Ham SQL yok.
/// Geçersiz entity/alan için <see cref="ArgumentException"/> fırlatır (mesaj geçerli seçenekleri içerir).
/// </summary>
public interface IAnalyticsEngine
{
    /// <summary>entity null ise analiz edilebilir entity adları; doluysa o entity'nin alan kataloğu.</summary>
    AnalyticsCatalog GetCatalog(string? entity);

    Task<AnalyticsResult> RunAsync(AnalyticsSpec spec, CancellationToken cancellationToken = default);
}
