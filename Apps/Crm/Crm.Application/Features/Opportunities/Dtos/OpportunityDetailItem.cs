using Platform.Application.Modals.Common;

namespace Crm.Application.Features.Opportunities.Dtos;

public class OpportunityDetailItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public EntityReference? Account { get; set; }
    public EntityReference? PrimaryContact { get; set; }
    public string Stage { get; set; } = default!;
    public decimal? EstimatedAmount { get; set; }
    /// <summary>Deal-level para birimi (CurrencyType code). EstimatedAmount + ActualAmount + tüm satırlar bu currency'de.</summary>
    public string? Currency { get; set; }
    /// <summary>Sunucu tarafında Products satır toplamlarının (brüt) toplamından hesaplanır; read-only.</summary>
    public decimal? ActualAmount { get; set; }
    /// <summary>Sunucu hesaplar: satırların NetAmount toplamı (oran+tutar indirim uygulanmış); read-only.</summary>
    public decimal? ActualNetAmount { get; set; }
    /// <summary>Sunucu hesaplar: satırların toplam indirim tutarı (oran cinsinden + tutar cinsinden); read-only.</summary>
    public decimal? TotalDiscountAmount { get; set; }
    /// <summary>Sunucu hesaplar: efektif indirim oranı (%), TotalDiscountAmount / ActualAmount × 100; read-only.</summary>
    public decimal? TotalDiscountRate { get; set; }
    public int Probability { get; set; }
    public DateTime? CloseDate { get; set; }
    public string? LossReason { get; set; }
    public List<OpportunityProductModal> Products { get; set; } = new();
    public bool IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
