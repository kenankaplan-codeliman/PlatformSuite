namespace CodePro.Domain.Entities.Products;

/// <summary>Katalog–Ürün N:M bağlantı tablosu</summary>
public class ProductCatalogProduct
{
    public Guid ProductCatalogId { get; set; }
    public ProductCatalog ProductCatalog { get; set; } = null!;

    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
}
