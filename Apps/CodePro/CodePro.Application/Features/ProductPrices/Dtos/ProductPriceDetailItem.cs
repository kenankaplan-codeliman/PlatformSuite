using Platform.Application.Modals.Common;

namespace CodePro.Application.Features.ProductPrices.Dtos;

public class ProductPriceDetailItem
{
    public Guid Id { get; set; }
    public EntityReference? Product { get; set; }
    public EntityReference? SupplierAccount { get; set; }
    public EntityReference? PriceList { get; set; }
    public decimal MinimumQuantity { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime ValidUntil { get; set; }
    public decimal UnitPrice { get; set; }
    public string Currency { get; set; } = default!;
    public bool IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
