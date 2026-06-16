namespace Crm.Application.Features.Dashboard.Dtos;

/// <summary>Açık fırsat değerine göre en üst hesaplar.</summary>
public class TopAccountItem
{
    public Guid AccountId { get; set; }
    public string AccountName { get; set; } = default!;
    public long OpenOpportunityCount { get; set; }
    public decimal OpenOpportunityValue { get; set; }
}
