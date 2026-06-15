using Platform.Application.Common.Abstractions;
using Platform.Application.Modals.Common;

namespace Crm.Application.Features.Leads.Commands.ImportLeads;

/// <summary>
/// CSV'den toplu Lead oluşturma komutu. Asistanın CSV import aracı, sütun eşlemesini uygulayıp
/// satırları <see cref="Rows"/> olarak doldurur ve bu komutu çağırır. Tek transaction içinde
/// çalışır (ICommand → TransactionBehavior); geçersiz satırlar atlanır ve hata listesine yazılır.
/// </summary>
public sealed class ImportLeadsCommand : ICommand<ImportLeadsResult>
{
    public List<ImportLeadRow> Rows { get; init; } = new();

    /// <summary>Oluşturulacak Lead'lerin statüsü (GeneralParameter LeadStatus kodu).</summary>
    public string Status { get; init; } = "AssistantDraft";
}

public sealed class ImportLeadRow
{
    public string? Subject { get; init; }
    public string? FirstName { get; init; }
    public string? LastName { get; init; }
    public string? Title { get; init; }
    public string? Department { get; init; }
    public string? Company { get; init; }
    public string? Industry { get; init; }
    public string? Website { get; init; }
    public string? Email { get; init; }
    public string? Phone { get; init; }
}

public sealed class ImportLeadsResult
{
    public int Created { get; set; }
    public int Failed { get; set; }
    public List<string> Errors { get; set; } = new();
    public List<EntityReference> CreatedLinks { get; set; } = new();
}
