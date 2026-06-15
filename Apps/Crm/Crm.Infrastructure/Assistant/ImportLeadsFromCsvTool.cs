using System.Text;
using System.Text.Json;
using Crm.Application.Features.Leads.Commands.ImportLeads;
using Platform.Application.Common.Assistant;
using MediatR;

namespace Crm.Infrastructure.Assistant;

/// <summary>
/// CSV→toplu Lead aracı. Orchestrator CSV önizlemesini LLM'e metin olarak verir; Claude sütun
/// eşlemesini önerip bu aracı çağırır. Araç tam CSV'yi IAssistantRequestContext'ten okur, eşlemeyi
/// uygular ve ImportLeadsCommand'ı (tek transaction, "AssistantDraft" statüsü) dispatch eder.
/// </summary>
public sealed class ImportLeadsFromCsvTool : IAssistantTool
{
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    private readonly ISender _sender;
    private readonly IAssistantRequestContext _context;

    public ImportLeadsFromCsvTool(ISender sender, IAssistantRequestContext context)
    {
        _sender = sender;
        _context = context;
    }

    public string Name => "import_leads_from_csv";

    public string Description =>
        "Kullanıcı bir CSV dosyası yüklediğinde toplu aday (Lead) oluşturmak için bu aracı çağır. " +
        "columnMapping: CSV başlığını lead alanına eşleyen nesne; geçerli lead alanları: " +
        "firstName, lastName, company, title, department, industry, website, email, phone, subject. " +
        "Örnek: { \"Ad Soyad\": \"firstName\", \"E-posta\": \"email\", \"Firma\": \"company\" }.";

    public bool RequiresConfirmation => true;

    public string Summarize(string argumentsJson)
    {
        var args = JsonSerializer.Deserialize<Args>(argumentsJson, JsonOptions) ?? new Args();
        return $"CSV'den toplu aday içe aktarılacak ({args.ColumnMapping?.Count ?? 0} sütun eşlemesi).";
    }

    public string InputSchemaJson =>
        """
        {
          "type": "object",
          "properties": {
            "columnMapping": {
              "type": "object",
              "description": "CSV başlığı -> lead alanı eşlemesi",
              "additionalProperties": { "type": "string" }
            }
          },
          "required": ["columnMapping"]
        }
        """;

    public async Task<AssistantToolResult> ExecuteAsync(string argumentsJson, CancellationToken cancellationToken = default)
    {
        if (!_context.IsCsv || _context.Bytes is not { Length: > 0 })
            return new AssistantToolResult { IsError = true, Text = "İçe aktarılacak CSV dosyası bulunamadı." };

        var args = JsonSerializer.Deserialize<Args>(argumentsJson, JsonOptions) ?? new Args();
        if (args.ColumnMapping is null || args.ColumnMapping.Count == 0)
            return new AssistantToolResult { IsError = true, Text = "Sütun eşlemesi (columnMapping) gerekli." };

        var csvRows = SimpleCsv.Parse(_context.Bytes);
        if (csvRows.Count == 0)
            return new AssistantToolResult { IsError = true, Text = "CSV'de veri satırı bulunamadı." };

        var rows = csvRows.Select(csv => MapRow(csv, args.ColumnMapping)).ToList();

        var result = await _sender.Send(new ImportLeadsCommand { Rows = rows }, cancellationToken);
        if (result.IsFailure)
            return new AssistantToolResult { IsError = true, Text = $"İçe aktarma başarısız: {result.Error.Message}" };

        var data = result.Value;
        var text = new StringBuilder($"{data.Created} aday oluşturuldu");
        if (data.Failed > 0)
            text.Append($", {data.Failed} satır atlandı");
        text.Append('.');
        foreach (var error in data.Errors.Take(10))
            text.Append($"\n- {error}");

        return new AssistantToolResult { Text = text.ToString(), Links = data.CreatedLinks };
    }

    private static ImportLeadRow MapRow(Dictionary<string, string> csv, Dictionary<string, string> mapping)
    {
        var fields = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        foreach (var (csvHeader, leadField) in mapping)
        {
            if (csv.TryGetValue(csvHeader, out var value) && !string.IsNullOrWhiteSpace(value))
                fields[leadField] = value.Trim();
        }

        return new ImportLeadRow
        {
            Subject = Get(fields, "subject"),
            FirstName = Get(fields, "firstName"),
            LastName = Get(fields, "lastName"),
            Title = Get(fields, "title"),
            Department = Get(fields, "department"),
            Company = Get(fields, "company"),
            Industry = Get(fields, "industry"),
            Website = Get(fields, "website"),
            Email = Get(fields, "email"),
            Phone = Get(fields, "phone"),
        };
    }

    private static string? Get(Dictionary<string, string> fields, string key) =>
        fields.TryGetValue(key, out var value) ? value : null;

    private sealed class Args
    {
        public Dictionary<string, string>? ColumnMapping { get; set; }
    }
}
