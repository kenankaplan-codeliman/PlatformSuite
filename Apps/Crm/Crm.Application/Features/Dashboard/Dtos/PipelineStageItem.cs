namespace Crm.Application.Features.Dashboard.Dtos;

/// <summary>Satış pipeline'ında bir aşamanın kırılımı (stage code + sayı + tutar).</summary>
public class PipelineStageItem
{
    public string Stage { get; set; } = default!;
    public long Count { get; set; }
    public decimal TotalValue { get; set; }
}
