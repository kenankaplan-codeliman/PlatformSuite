using Crm.Domain.Enums;

namespace Crm.Application.Features.Leads.Dtos;

public class LeadListFilter
{
    public string? Search { get; set; }
    public LeadStatus? Status { get; set; }
    public LeadSource? Source { get; set; }
    public bool? IsActive { get; set; }
}
