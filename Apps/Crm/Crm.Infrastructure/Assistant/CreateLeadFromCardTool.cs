using System.Text.Json;
using Crm.Application.Common.Dtos.Communications;
using Crm.Application.Features.Leads.Commands.CreateLead;
using Crm.Domain.Entities.Leads;
using Crm.Domain.Enums;
using Platform.Application.Common.Assistant;
using Platform.Application.Modals.Common;
using MediatR;

namespace Crm.Infrastructure.Assistant;

/// <summary>
/// Kartvizit→Lead aracı. Görsel, orchestrator tarafından LLM mesajına vision bloğu olarak
/// eklenir; Claude alanları çıkarıp bu aracı yapılandırılmış argümanlarla çağırır. Araç, mevcut
/// CreateLeadCommand'ı "AssistantDraft" statüsüyle dispatch eder (doğrulama + communications sync
/// yeniden kullanılır).
/// </summary>
public sealed class CreateLeadFromCardTool : IAssistantTool
{
    public const string DraftStatus = "AssistantDraft";

    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    private readonly ISender _sender;

    public CreateLeadFromCardTool(ISender sender) => _sender = sender;

    public string Name => "create_lead";

    public string Description =>
        "Taranan bir kartvizitten kişi/firma bilgilerini çıkardıktan sonra bu aracı çağırarak " +
        "özel 'Asistan Taslağı' statüsünde bir aday (Lead) oluştur. En az ad/soyad veya firma adı gerekir. " +
        "E-posta ve telefonları ilgili dizilere ekle.";

    public bool RequiresConfirmation => true;

    public string Summarize(string argumentsJson)
    {
        var args = JsonSerializer.Deserialize<Args>(argumentsJson, JsonOptions) ?? new Args();
        return $"Taslak aday oluşturulacak: {ResolveSubject(args) ?? "yeni aday"}";
    }

    public string InputSchemaJson =>
        """
        {
          "type": "object",
          "properties": {
            "subject": { "type": "string", "description": "Aday başlığı (boşsa ad-soyad veya firmadan üretilir)" },
            "firstName": { "type": "string" },
            "lastName": { "type": "string" },
            "title": { "type": "string", "description": "Unvan" },
            "department": { "type": "string", "description": "Departman" },
            "company": { "type": "string", "description": "Firma adı" },
            "industry": { "type": "string", "description": "Sektör" },
            "website": { "type": "string" },
            "emails": { "type": "array", "items": { "type": "string" } },
            "phones": { "type": "array", "items": { "type": "string" } }
          }
        }
        """;

    public async Task<AssistantToolResult> ExecuteAsync(string argumentsJson, CancellationToken cancellationToken = default)
    {
        var args = JsonSerializer.Deserialize<Args>(argumentsJson, JsonOptions) ?? new Args();

        var subject = ResolveSubject(args);
        if (string.IsNullOrWhiteSpace(subject))
            return new AssistantToolResult { IsError = true, Text = "Aday oluşturmak için en az ad/soyad veya firma adı gerekli." };

        var command = new CreateLeadCommand
        {
            Subject = subject,
            FirstName = args.FirstName,
            LastName = args.LastName,
            Title = args.Title,
            Department = args.Department,
            Company = args.Company,
            Industry = args.Industry,
            Website = args.Website,
            Status = DraftStatus,
            Source = "Other",
            Emails = BuildEmails(args.Emails),
            Phones = BuildPhones(args.Phones),
        };

        var result = await _sender.Send(command, cancellationToken);
        if (result.IsFailure)
            return new AssistantToolResult { IsError = true, Text = $"Aday oluşturulamadı: {result.Error.Message}" };

        var lead = result.Value;
        return new AssistantToolResult
        {
            Text = $"'{lead.Subject}' adlı taslak aday oluşturuldu.",
            Links = { new EntityReference(nameof(Lead)) { Id = lead.Id, Name = lead.Subject } },
        };
    }

    private static string? ResolveSubject(Args args)
    {
        if (!string.IsNullOrWhiteSpace(args.Subject))
            return args.Subject.Trim();

        var fullName = $"{args.FirstName} {args.LastName}".Trim();
        if (!string.IsNullOrWhiteSpace(fullName))
            return fullName;

        return string.IsNullOrWhiteSpace(args.Company) ? null : args.Company.Trim();
    }

    private static List<EmailModal> BuildEmails(List<string>? emails) =>
        (emails ?? new())
        .Where(e => !string.IsNullOrWhiteSpace(e))
        .Select((e, i) => new EmailModal { Email = e.Trim(), Type = EmailType.Work, IsPrimary = i == 0 })
        .ToList();

    private static List<PhoneModal> BuildPhones(List<string>? phones) =>
        (phones ?? new())
        .Where(p => !string.IsNullOrWhiteSpace(p))
        .Select((p, i) => new PhoneModal { PhoneNumber = p.Trim(), Type = PhoneType.Work, IsPrimary = i == 0 })
        .ToList();

    private sealed class Args
    {
        public string? Subject { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Title { get; set; }
        public string? Department { get; set; }
        public string? Company { get; set; }
        public string? Industry { get; set; }
        public string? Website { get; set; }
        public List<string>? Emails { get; set; }
        public List<string>? Phones { get; set; }
    }
}
