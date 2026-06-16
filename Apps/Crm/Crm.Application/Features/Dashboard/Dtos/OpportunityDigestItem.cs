namespace Crm.Application.Features.Dashboard.Dtos;

/// <summary>Dashboard liste widget'ları için hafif fırsat özeti.</summary>
public class OpportunityDigestItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string? OpportunityCode { get; set; }
    public Guid AccountId { get; set; }
    public string? AccountName { get; set; }
    public string Stage { get; set; } = default!;
    public decimal? Amount { get; set; }
    public string? Currency { get; set; }
    public int Probability { get; set; }
    public DateTime? CloseDate { get; set; }
}
