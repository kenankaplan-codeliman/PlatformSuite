namespace CodePro.Application.Features.ProductCatalogs.Dtos;

public class ProductCatalogListItem
{
    public Guid Id { get; set; }
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    public DateTime ValidFrom { get; set; }
    public DateTime ValidUntil { get; set; }
    public string? PriceCode { get; set; }
    public int ProductCount { get; set; }
    public int OrganizationCount { get; set; }
    public bool IsActive { get; set; }
}
