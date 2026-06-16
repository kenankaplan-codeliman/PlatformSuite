namespace Crm.Application.Features.Dashboard.Dtos;

/// <summary>Sayı + tutar taşıyan KPI kartı (açık fırsatlar, bu ay kazanılan).</summary>
public class KpiValueItem
{
    public long Count { get; set; }
    public decimal TotalValue { get; set; }
}

/// <summary>Sadece sayı taşıyan KPI kartı (bu ay yeni lead).</summary>
public class KpiCountItem
{
    public long Count { get; set; }
}

/// <summary>Lead → Opportunity dönüşüm oranı KPI'ı (bu ay).</summary>
public class ConversionRateItem
{
    public long TotalCount { get; set; }
    public long ConvertedCount { get; set; }

    /// <summary>0-100 arası yüzde. TotalCount 0 ise 0.</summary>
    public decimal Rate { get; set; }
}

/// <summary>Kazanılan/Kaybedilen fırsat özeti (bu ay).</summary>
public class WonLostItem
{
    public long WonCount { get; set; }
    public decimal WonValue { get; set; }
    public long LostCount { get; set; }
    public decimal LostValue { get; set; }
}
