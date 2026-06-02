namespace Crm.Application.Features.Products.Dtos;

public class ProductDetailItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string ProductCode { get; set; } = default!;
    public string? Category { get; set; }
    public decimal? UnitPrice { get; set; }
    public string? UnitPriceCurrency { get; set; }
    public string? UnitOfMeasure { get; set; }
    public string? Description { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsActive { get; set; }
}
