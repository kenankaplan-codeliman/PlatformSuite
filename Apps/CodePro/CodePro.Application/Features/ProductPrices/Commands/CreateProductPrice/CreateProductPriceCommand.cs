using CodePro.Application.Features.ProductPrices.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Modals.Common;

namespace CodePro.Application.Features.ProductPrices.Commands.CreateProductPrice;

public sealed class CreateProductPriceCommand : ICommand<ProductPriceDetailItem>
{
    public EntityReference? Product { get; init; }
    public EntityReference? SupplierAccount { get; init; }
    public EntityReference? PriceList { get; init; }
    public decimal MinimumQuantity { get; init; }
    public DateTime ValidFrom { get; init; }
    public DateTime ValidUntil { get; init; }
    public decimal UnitPrice { get; init; }
    public string Currency { get; init; } = "TRY";
}
