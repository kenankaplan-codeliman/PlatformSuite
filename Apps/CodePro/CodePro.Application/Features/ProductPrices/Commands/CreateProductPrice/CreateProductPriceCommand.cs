using CodePro.Application.Features.ProductPrices.Dtos;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.ProductPrices.Commands.CreateProductPrice;

public sealed class CreateProductPriceCommand : ICommand<ProductPriceDetailItem>
{
    public Guid ProductId { get; init; }
    public Guid SupplierAccountId { get; init; }
    public Guid? PriceListId { get; init; }
    public decimal MinimumQuantity { get; init; }
    public DateTime ValidFrom { get; init; }
    public DateTime ValidUntil { get; init; }
    public decimal UnitPrice { get; init; }
    public string Currency { get; init; } = "TRY";
}
