namespace Crm.Application.Features.Opportunities.Dtos;

public class OpportunityListFilter
{
    public string? Search { get; set; }
    public string? Stage { get; set; }
    public Guid? AccountId { get; set; }
    public bool? IsActive { get; set; }
}
