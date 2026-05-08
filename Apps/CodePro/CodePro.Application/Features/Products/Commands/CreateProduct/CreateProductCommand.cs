using CodePro.Application.Features.Products.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Modals.Common;

namespace CodePro.Application.Features.Products.Commands.CreateProduct;

public sealed class CreateProductCommand : ICommand<ProductDetailItem>
{
    public string Code { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string ShortDescription { get; init; } = string.Empty;
    public string? DetailedDescription { get; init; }
    public DateTime ValidFrom { get; init; }
    public DateTime ValidUntil { get; init; }
    public string? UnitOfMeasure { get; init; }
    public string? ManufacturerPartNumber { get; init; }
    public string? Model { get; init; }
    public string? Color { get; init; }
    public string? ProductUrl { get; init; }
    public int? QuantityPerUnit { get; init; }
    public int DeliveryDays { get; init; }
    public Guid? AccountCodeId { get; init; }
    public EntityReference? ProductCategory { get; init; }

    public List<Guid> BrandIds { get; init; } = new();
    public List<Guid> ManufacturerIds { get; init; } = new();
    public List<string> Keywords { get; init; } = new();
    public List<ProductSkuFormItem> SupplierSkus { get; init; } = new();
}

public sealed class ProductSkuFormItem
{
    public EntityReference? Supplier { get; init; }
    public string Sku { get; init; } = string.Empty;
}
