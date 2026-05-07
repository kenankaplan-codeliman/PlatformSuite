using Crm.Domain.Enums;
using Platform.Application.Modals.Common;

namespace Crm.Application.Features.Opportunities.Dtos;

public class OpportunityDetailItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public EntityReference? Account { get; set; }
    public EntityReference? PrimaryContact { get; set; }
    public OpportunityStage Stage { get; set; }
    public decimal? Amount { get; set; }
    public int Probability { get; set; }
    public DateTime? CloseDate { get; set; }
    public string? LossReason { get; set; }
    public bool IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
