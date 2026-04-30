using Crm.Domain.Enums;

namespace Crm.Application.Features.Leads.Dtos;

public class LeadListItem
{
    public Guid Id { get; set; }
    public string Subject { get; set; } = default!;
    public string? FullName { get; set; }
    public string? Company { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public LeadSource Source { get; set; }
    public LeadStatus Status { get; set; }
    public int? Score { get; set; }
    public decimal? EstimatedValue { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
