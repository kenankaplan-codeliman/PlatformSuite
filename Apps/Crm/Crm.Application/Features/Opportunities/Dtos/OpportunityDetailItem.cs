using Crm.Domain.Enums;

namespace Crm.Application.Features.Opportunities.Dtos;

public class OpportunityDetailItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public Guid AccountId { get; set; }
    public string? AccountName { get; set; }
    public Guid? PrimaryContactId { get; set; }
    public string? PrimaryContactName { get; set; }
    public OpportunityStage Stage { get; set; }
    public decimal? Amount { get; set; }
    public int Probability { get; set; }
    public DateTime? CloseDate { get; set; }
    public string? LossReason { get; set; }
    public bool IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
