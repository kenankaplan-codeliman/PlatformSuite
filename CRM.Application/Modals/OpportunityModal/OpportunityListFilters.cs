using CRM.Domain.Enums;

namespace CRM.Application.Modals.OpportunityModal;

public class OpportunityListFilters
{
    public string? Name { get; set; }

    public OpportunityStage? Stage { get; set; }

    public Guid? AccountId { get; set; }

    public OpportunitySource? Source { get; set; }

    public bool? IsActive { get; set; }
}