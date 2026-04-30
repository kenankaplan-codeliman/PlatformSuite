namespace CodePro.Domain.Entities.Products;

/// <summary>Ürün–Üretici N:M bağlantı tablosu</summary>
public class ProductManufacturer
{
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public Guid ManufacturerId { get; set; }
    public Manufacturer Manufacturer { get; set; } = null!;
}
