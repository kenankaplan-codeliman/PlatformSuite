using CRM.Domain.Enums;

namespace CRM.Application.Modals.OpportunityModal;

public class OpportunityDetailItem
{
    public Guid Id { get; set; }

    public required string Name { get; set; }

    public string? Description { get; set; }

    public OpportunityStage Stage { get; set; }

    public int Probability { get; set; }

    public decimal EstimatedValue { get; set; }

    public decimal? ActualValue { get; set; }

    public required string Currency { get; set; }

    public DateTime? CloseDate { get; set; }

    public OpportunitySource? Source { get; set; }

    public Guid AccountId { get; set; }

    public string? AccountName { get; set; }

    public Guid? ContactId { get; set; }

    public string? ContactName { get; set; }

    public List<OpportunityProductItem> Products { get; set; } = [];

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool IsActive { get; set; }
}