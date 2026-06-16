namespace Crm.Application.Features.Opportunities.Dtos;

public class OpportunityListItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    /// <summary>Fırsat Kodu — numarator ile üretilir; listede 2. kolon.</summary>
    public string? OpportunityCode { get; set; }
    public Guid AccountId { get; set; }
    public string? AccountName { get; set; }
    public string Stage { get; set; } = default!;
    public decimal? EstimatedAmount { get; set; }
    public decimal? ActualAmount { get; set; }
    /// <summary>Deal currency (CurrencyType code). Amount kolonlarını sıralı/anlamlı göstermek için liste DTO'sunda da taşınır.</summary>
    public string? Currency { get; set; }
    public int Probability { get; set; }
    public DateTime? CloseDate { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
