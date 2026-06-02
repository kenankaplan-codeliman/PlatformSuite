namespace Crm.Application.Features.Products.Dtos;

public class ProductListItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string ProductCode { get; set; } = default!;
    public string? Category { get; set; }
    public decimal? UnitPrice { get; set; }
    public string? UnitPriceCurrency { get; set; }
    public string? UnitOfMeasure { get; set; }
    public bool IsActive { get; set; }
}
