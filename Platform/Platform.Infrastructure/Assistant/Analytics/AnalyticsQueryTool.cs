using System.Globalization;
using System.Text;
using System.Text.Json;
using Platform.Application.Common.Assistant;
using Platform.Application.Common.Assistant.Analytics;

namespace Platform.Infrastructure.Assistant.Analytics;

/// <summary>
/// Entity-bağımsız analitik sorgu aracı. Spec'i <see cref="IAnalyticsEngine"/>'e verir; motor
/// reflection + güvenli LINQ ile (ham SQL yok) toplulaştırır. Satır-bazlı yetki EF global query
/// filter ile otomatik uygulanır. Geçersiz entity/alan → hata mesajında geçerli seçenekler listelenir.
/// </summary>
public sealed class AnalyticsQueryTool : IAssistantTool
{
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    private readonly IAnalyticsEngine _engine;

    public AnalyticsQueryTool(IAnalyticsEngine engine) => _engine = engine;

    public string Name => "analytics_query";

    public string Description =>
        "Sayısal/analitik sorular için çağır (örn. 'kaynağa göre aday adedi', 'aşamaya göre fırsat " +
        "toplam tutarı ve ortalaması'). Alan adlarını önce analytics_schema ile öğren. " +
        "entity zorunlu. groupBy: kırılım boyutu (opsiyonel). measure: sayısal alan (sum/avg/min/max için gerekli). " +
        "aggregations: count/sum/avg/min/max. filters: [{field, op, value}] — op: eq/neq/gt/gte/lt/lte/contains.";

    public string InputSchemaJson =>
        """
        {
          "type": "object",
          "properties": {
            "entity": { "type": "string", "description": "Sorgulanacak entity (analytics_schema'dan)" },
            "measure": { "type": "string", "description": "Sayısal ölçü alanı (sum/avg/min/max için gerekli)" },
            "groupBy": { "type": "string", "description": "Kırılım boyutu (string alan)" },
            "aggregations": {
              "type": "array",
              "items": { "type": "string", "enum": ["count", "sum", "avg", "min", "max"] }
            },
            "filters": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "field": { "type": "string" },
                  "op": { "type": "string", "enum": ["eq", "neq", "gt", "gte", "lt", "lte", "contains"] },
                  "value": { "type": "string" }
                },
                "required": ["field", "op", "value"]
              }
            }
          },
          "required": ["entity"]
        }
        """;

    public async Task<AssistantToolResult> ExecuteAsync(string argumentsJson, CancellationToken cancellationToken = default)
    {
        var spec = JsonSerializer.Deserialize<AnalyticsSpec>(argumentsJson, JsonOptions) ?? new AnalyticsSpec();
        if (string.IsNullOrWhiteSpace(spec.Entity))
            return new AssistantToolResult { IsError = true, Text = "entity gerekli. Önce analytics_schema çağırın." };

        AnalyticsResult result;
        try
        {
            result = await _engine.RunAsync(spec, cancellationToken);
        }
        catch (ArgumentException ex)
        {
            return new AssistantToolResult { IsError = true, Text = ex.Message };
        }

        var sb = new StringBuilder(result.Description).Append(':');
        if (result.Rows.Count == 0)
        {
            sb.Append(" (kayıt yok)");
        }
        else
        {
            var grouped = !(result.Rows.Count == 1 && result.Rows[0].Key.Length == 0);
            foreach (var row in result.Rows)
            {
                sb.Append('\n');
                sb.Append("- ");
                if (grouped)
                    sb.Append(row.Key).Append(": ");
                sb.Append(FormatRow(row));
            }
        }

        return new AssistantToolResult { Text = sb.ToString() };
    }

    private static string FormatRow(AnalyticsRow row)
    {
        var parts = new List<string> { $"adet={row.Count}" };
        if (row.Sum is not null) parts.Add($"toplam={Fmt(row.Sum)}");
        if (row.Average is not null) parts.Add($"ortalama={Fmt(row.Average)}");
        if (row.Min is not null) parts.Add($"min={Fmt(row.Min)}");
        if (row.Max is not null) parts.Add($"maks={Fmt(row.Max)}");
        return string.Join(", ", parts);
    }

    private static string Fmt(decimal? value) =>
        value?.ToString("0.##", CultureInfo.InvariantCulture) ?? "-";
}
