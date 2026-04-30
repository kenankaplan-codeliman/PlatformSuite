using Crm.Domain.Enums;

namespace Crm.Application.Features.Opportunities.Dtos;

public class OpportunityListFilter
{
    public string? Search { get; set; }
    public OpportunityStage? Stage { get; set; }
    public Guid? AccountId { get; set; }
    public bool? IsActive { get; set; }
}
