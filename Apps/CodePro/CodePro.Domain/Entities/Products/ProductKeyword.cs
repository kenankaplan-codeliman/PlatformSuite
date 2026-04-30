namespace CodePro.Domain.Entities.Products;

/// <summary>Ürün arama anahtar kelimesi</summary>
public class ProductKeyword
{
    public Guid Id { get; set; }

    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public string Keyword { get; set; } = null!;
}
