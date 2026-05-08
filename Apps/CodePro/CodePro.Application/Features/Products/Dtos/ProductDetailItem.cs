using Platform.Application.Modals.Common;

namespace CodePro.Application.Features.Products.Dtos;

public class ProductDetailItem
{
    public Guid Id { get; set; }
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string ShortDescription { get; set; } = default!;
    public string? DetailedDescription { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime ValidUntil { get; set; }
    public string? UnitOfMeasure { get; set; }
    public string? ManufacturerPartNumber { get; set; }
    public string? Model { get; set; }
    public string? Color { get; set; }
    public string? ProductUrl { get; set; }
    public int? QuantityPerUnit { get; set; }
    public int DeliveryDays { get; set; }
    public Guid? AccountCodeId { get; set; }

    public EntityReference? ProductCategory { get; set; }

    public bool IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public List<ProductBrandItem> Brands { get; set; } = new();
    public List<ProductManufacturerItem> Manufacturers { get; set; } = new();
    public List<ProductKeywordItem> Keywords { get; set; } = new();
    public List<ProductSkuItem> SupplierSkus { get; set; } = new();
}

public class ProductBrandItem
{
    public Guid BrandId { get; set; }
    public string? BrandName { get; set; }
}

public class ProductManufacturerItem
{
    public Guid ManufacturerId { get; set; }
    public string? ManufacturerName { get; set; }
}

public class ProductKeywordItem
{
    public Guid Id { get; set; }
    public string Keyword { get; set; } = default!;
}

public class ProductSkuItem
{
    public Guid Id { get; set; }
    public EntityReference? Supplier { get; set; }
    public string Sku { get; set; } = default!;
}
