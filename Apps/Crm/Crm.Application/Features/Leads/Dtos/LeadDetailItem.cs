using Crm.Application.Common.Dtos.Communications;

namespace Crm.Application.Features.Leads.Dtos;

public class LeadDetailItem
{
    public Guid Id { get; set; }
    public string Subject { get; set; } = default!;

    // Kişi bilgisi
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Title { get; set; }
    public string? Department { get; set; }

    // Firma bilgisi
    public string? Company { get; set; }
    public string? Industry { get; set; }
    public string? Website { get; set; }

    public string Source { get; set; } = default!;
    public string Status { get; set; } = default!;
    public string? Rating { get; set; }
    public int? Score { get; set; }
    public decimal? EstimatedValue { get; set; }
    public string? EstimatedValueCurrency { get; set; }
    public string? Description { get; set; }

    // İletişim — Account/Contact ile aynı polimorfik Communications modeli.
    public List<EmailModal> Emails { get; set; } = new();
    public List<PhoneModal> Phones { get; set; } = new();
    public List<AddressModal> Addresses { get; set; } = new();

    public Guid? ConvertedAccountId { get; set; }
    public string? ConvertedAccountName { get; set; }
    public Guid? ConvertedContactId { get; set; }
    public string? ConvertedContactName { get; set; }
    public DateTime? ConvertedAt { get; set; }

    public bool IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
