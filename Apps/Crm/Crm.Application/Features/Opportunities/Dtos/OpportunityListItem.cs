using Crm.Domain.Enums;

namespace Crm.Application.Features.Opportunities.Dtos;

public class OpportunityListItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public Guid AccountId { get; set; }
    public string? AccountName { get; set; }
    public OpportunityStage Stage { get; set; }
    public decimal? Amount { get; set; }
    public int Probability { get; set; }
    public DateTime? CloseDate { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
