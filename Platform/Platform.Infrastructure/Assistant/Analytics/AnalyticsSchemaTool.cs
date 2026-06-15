using System.Text;
using System.Text.Json;
using Platform.Application.Common.Assistant;
using Platform.Application.Common.Assistant.Analytics;

namespace Platform.Infrastructure.Assistant.Analytics;

/// <summary>
/// Analitik için kullanılabilir entity'leri ve alanları (reflection ile) döndürür.
/// LLM, analytics_query'den önce bunu çağırıp doğru alan adlarını öğrenir.
/// </summary>
public sealed class AnalyticsSchemaTool : IAssistantTool
{
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    private readonly IAnalyticsEngine _engine;

    public AnalyticsSchemaTool(IAnalyticsEngine engine) => _engine = engine;

    public string Name => "analytics_schema";

    public string Description =>
        "Analitik sorgudan ÖNCE çağır. entity verilmezse analiz edilebilir entity adlarını döner; " +
        "bir entity verilirse o entity'nin gruplanabilir boyutlarını (dimensions), ölçülebilir " +
        "sayısal alanlarını (measures) ve tarih alanlarını döner. analytics_query'de tam bu adları kullan.";

    public string InputSchemaJson =>
        """
        {
          "type": "object",
          "properties": {
            "entity": { "type": "string", "description": "Alanları listelenecek entity (opsiyonel)" }
          }
        }
        """;

    public Task<AssistantToolResult> ExecuteAsync(string argumentsJson, CancellationToken cancellationToken = default)
    {
        var args = JsonSerializer.Deserialize<Args>(argumentsJson, JsonOptions) ?? new Args();

        AnalyticsCatalog catalog;
        try
        {
            catalog = _engine.GetCatalog(args.Entity);
        }
        catch (ArgumentException ex)
        {
            return Task.FromResult(new AssistantToolResult { IsError = true, Text = ex.Message });
        }

        var sb = new StringBuilder();
        if (catalog.Entities is not null)
        {
            sb.Append("Analiz edilebilir entity'ler: ");
            sb.Append(string.Join(", ", catalog.Entities));
        }
        else
        {
            sb.AppendLine($"{catalog.Entity} alanları:");
            sb.AppendLine($"- Boyutlar (groupBy): {Join(catalog.Dimensions)}");
            sb.AppendLine($"- Ölçüler (measure): {Join(catalog.Measures)}");
            sb.Append($"- Tarih alanları (filtre): {Join(catalog.DateFields)}");
        }

        return Task.FromResult(new AssistantToolResult { Text = sb.ToString() });
    }

    private static string Join(List<string> items) => items.Count == 0 ? "(yok)" : string.Join(", ", items);

    private sealed class Args
    {
        public string? Entity { get; set; }
    }
}
