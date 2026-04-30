namespace CodePro.Application.Features.ProductPrices.Dtos;

public class ProductPriceDetailItem
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string? ProductName { get; set; }
    public Guid SupplierAccountId { get; set; }
    public string? SupplierAccountName { get; set; }
    public Guid? PriceListId { get; set; }
    public string? PriceListName { get; set; }
    public decimal MinimumQuantity { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime ValidUntil { get; set; }
    public decimal UnitPrice { get; set; }
    public string Currency { get; set; } = default!;
    public bool IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
