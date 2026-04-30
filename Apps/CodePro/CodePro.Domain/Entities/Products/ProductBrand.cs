namespace CodePro.Domain.Entities.Products;

/// <summary>Ürün–Marka N:M bağlantı tablosu</summary>
public class ProductBrand
{
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public Guid BrandId { get; set; }
    public Brand Brand { get; set; } = null!;
}
