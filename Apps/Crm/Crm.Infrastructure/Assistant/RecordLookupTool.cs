using System.Text;
using System.Text.Json;
using Platform.Application.Common.Assistant;
using Platform.Application.Common.Pagination;
using Platform.Application.Features.References.Queries.SearchReferences;
using Platform.Application.Modals.Common;
using MediatR;

namespace Crm.Infrastructure.Assistant;

/// <summary>
/// Lookup search aracı — mevcut polimorfik EntityReference lookup altyapısını (SearchReferencesQuery
/// → IReferenceRepository → resolver registry) yeniden kullanır. Yeni bir resolver eklendiğinde
/// otomatik aranabilir hale gelir.
/// </summary>
public sealed class RecordLookupTool : IAssistantTool
{
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    private readonly ISender _sender;

    public RecordLookupTool(ISender sender) => _sender = sender;

    public string Name => "lookup_records";

    public string Description =>
        "Kullanıcı bir kaydı aramak veya bulmak istediğinde bu aracı çağır. entityType geçerli " +
        "değerler: Account (firma), Contact (kişi), Lead (aday), Opportunity (fırsat), Product (ürün), " +
        "User (kullanıcı). searchText aranacak metindir. Bulunan kayıtların bağlantıları kullanıcıya listelenir.";

    public string InputSchemaJson =>
        """
        {
          "type": "object",
          "properties": {
            "entityType": {
              "type": "string",
              "enum": ["Account", "Contact", "Lead", "Opportunity", "Product", "User"],
              "description": "Aranacak kayıt türü"
            },
            "searchText": { "type": "string", "description": "Arama metni" }
          },
          "required": ["entityType", "searchText"]
        }
        """;

    public async Task<AssistantToolResult> ExecuteAsync(string argumentsJson, CancellationToken cancellationToken = default)
    {
        var args = JsonSerializer.Deserialize<Args>(argumentsJson, JsonOptions) ?? new Args();
        if (string.IsNullOrWhiteSpace(args.EntityType))
            return new AssistantToolResult { IsError = true, Text = "entityType gerekli." };

        var result = await _sender.Send(
            new SearchReferencesQuery
            {
                EntityType = args.EntityType,
                SearchText = args.SearchText,
                Pagination = new PaginationRequest { PageNumber = 1, PageSize = 10 },
            },
            cancellationToken);

        if (result.IsFailure)
            return new AssistantToolResult { IsError = true, Text = $"Arama başarısız: {result.Error.Message}" };

        var data = result.Value.Data;
        if (data.Count == 0)
            return new AssistantToolResult { Text = $"'{args.SearchText}' için {args.EntityType} kaydı bulunamadı." };

        var text = new StringBuilder($"{data.Count} kayıt bulundu:");
        foreach (var item in data)
            text.Append($"\n- {item.Name}");

        return new AssistantToolResult { Text = text.ToString(), Links = data };
    }

    private sealed class Args
    {
        public string? EntityType { get; set; }
        public string? SearchText { get; set; }
    }
}
