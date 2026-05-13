using Platform.Domain.Entities.Identities;

namespace CodePro.Domain.Entities.Products;

/// <summary>Katalog–Organizasyon N:M bağlantı tablosu</summary>
public class ProductCatalogOrganization
{
    public Guid ProductCatalogId { get; set; }
    public ProductCatalog ProductCatalog { get; set; } = null!;

    public Guid AppOrganizationId { get; set; }
    public AuthOrganization Organization { get; set; } = null!;
}
