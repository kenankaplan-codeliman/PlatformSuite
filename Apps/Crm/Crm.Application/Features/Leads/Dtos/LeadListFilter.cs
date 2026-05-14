namespace Crm.Application.Features.Leads.Dtos;

public class LeadListFilter
{
    public string? Search { get; set; }
    public string? Status { get; set; }
    public string? Source { get; set; }
    public bool? IsActive { get; set; }
}
