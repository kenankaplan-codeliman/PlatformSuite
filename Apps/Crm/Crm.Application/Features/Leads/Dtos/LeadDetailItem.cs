namespace Crm.Application.Features.Leads.Dtos;

public class LeadDetailItem
{
    public Guid Id { get; set; }
    public string Subject { get; set; } = default!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Company { get; set; }
    public string? Title { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Website { get; set; }
    public string Source { get; set; } = default!;
    public string Status { get; set; } = default!;
    public int? Score { get; set; }
    public decimal? EstimatedValue { get; set; }
    public string? EstimatedValueCurrency { get; set; }
    public string? Description { get; set; }

    public Guid? ConvertedAccountId { get; set; }
    public string? ConvertedAccountName { get; set; }
    public Guid? ConvertedContactId { get; set; }
    public string? ConvertedContactName { get; set; }
    public DateTime? ConvertedAt { get; set; }

    public bool IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
