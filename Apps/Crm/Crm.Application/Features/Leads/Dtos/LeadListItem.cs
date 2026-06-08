namespace Crm.Application.Features.Leads.Dtos;

public class LeadListItem
{
    public Guid Id { get; set; }
    public string Subject { get; set; } = default!;
    public string? FullName { get; set; }
    public string? Company { get; set; }

    // Email/Phone artık Communications modelinde — primary değerler handler'da doldurulur.
    public string? PrimaryEmail { get; set; }
    public string? PrimaryPhone { get; set; }

    public string Source { get; set; } = default!;
    public string Status { get; set; } = default!;
    public string? Rating { get; set; }
    public int? Score { get; set; }
    public decimal? EstimatedValue { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
