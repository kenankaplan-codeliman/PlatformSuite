namespace Platform.Application.Common.Assistant.Analytics;

/// <summary>
/// Sağlayıcı/entity-bağımsız analitik sorgu spec'i. Asistanın analytics_query aracı serbest
/// metin soruyu bu yapıya çevirir; <see cref="IAnalyticsEngine"/> reflection + güvenli LINQ ile
/// çalıştırır (ham SQL yok). Entity ve alanlar runtime'da reflection ile keşfedilir.
/// </summary>
public sealed class AnalyticsSpec
{
    public string Entity { get; set; } = string.Empty;

    /// <summary>Sayısal ölçü alanı (sum/avg/min/max için gerekli). Yoksa yalnız count.</summary>
    public string? Measure { get; set; }

    /// <summary>Kırılım boyutu (string alan). Yoksa tek toplam satır.</summary>
    public string? GroupBy { get; set; }

    /// <summary>count | sum | avg | min | max (boşsa count).</summary>
    public List<string> Aggregations { get; set; } = new();

    public List<AnalyticsFilter> Filters { get; set; } = new();
}

public sealed class AnalyticsFilter
{
    public string Field { get; set; } = string.Empty;

    /// <summary>eq | neq | gt | gte | lt | lte | contains</summary>
    public string Op { get; set; } = "eq";

    public string? Value { get; set; }
}

public sealed class AnalyticsResult
{
    public string Description { get; set; } = string.Empty;
    public List<AnalyticsRow> Rows { get; set; } = new();
}

public sealed class AnalyticsRow
{
    public string Key { get; set; } = string.Empty;
    public long Count { get; set; }
    public decimal? Sum { get; set; }
    public decimal? Average { get; set; }
    public decimal? Min { get; set; }
    public decimal? Max { get; set; }
}

/// <summary>
/// analytics_schema çıktısı. <see cref="Entities"/> yalnız entity adları istendiğinde dolu;
/// belirli bir entity sorulduğunda <see cref="Dimensions"/>/<see cref="Measures"/>/<see cref="DateFields"/> dolu.
/// </summary>
public sealed class AnalyticsCatalog
{
    public List<string>? Entities { get; set; }
    public string? Entity { get; set; }
    public List<string> Dimensions { get; set; } = new();
    public List<string> Measures { get; set; } = new();
    public List<string> DateFields { get; set; } = new();
}
