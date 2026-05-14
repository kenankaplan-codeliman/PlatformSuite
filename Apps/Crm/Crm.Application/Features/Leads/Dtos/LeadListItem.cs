namespace Crm.Application.Features.Leads.Dtos;

public class LeadListItem
{
    public Guid Id { get; set; }
    public string Subject { get; set; } = default!;
    public string? FullName { get; set; }
    public string? Company { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string Source { get; set; } = default!;
    public string Status { get; set; } = default!;
    public int? Score { get; set; }
    public decimal? EstimatedValue { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
