namespace CodePro.Application.Features.ProductCatalogs.Dtos;

public class ProductCatalogDetailItem
{
    public Guid Id { get; set; }
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime ValidUntil { get; set; }
    public string? PriceCode { get; set; }
    public bool IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public List<ProductCatalogProductItem> Products { get; set; } = new();
    public List<ProductCatalogOrganizationItem> Organizations { get; set; } = new();
}

public class ProductCatalogProductItem
{
    public Guid ProductId { get; set; }
    public string? ProductCode { get; set; }
    public string? ProductName { get; set; }
}

public class ProductCatalogOrganizationItem
{
    public Guid AppOrganizationId { get; set; }
    public string? OrganizationName { get; set; }
}
