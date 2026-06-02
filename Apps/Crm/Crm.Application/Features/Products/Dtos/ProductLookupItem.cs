namespace Crm.Application.Features.Products.Dtos;

/// <summary>
/// Opportunity satır kalemi lookup'ı için zenginleştirilmiş arama sonucu.
/// Düz EntityReference yerine birim fiyat/para birimi de döner ki ürün seçilince
/// satır kalemi bu değerlerle prefill edilebilsin.
/// </summary>
public class ProductLookupItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string ProductCode { get; set; } = default!;
    public decimal? UnitPrice { get; set; }
    public string? UnitPriceCurrency { get; set; }
    public string? UnitOfMeasure { get; set; }
}
