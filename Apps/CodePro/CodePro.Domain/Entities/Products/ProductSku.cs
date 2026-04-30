using Platform.Domain.Entities.Accounts;

namespace CodePro.Domain.Entities.Products;

/// <summary>Tedarikçi bazlı SKU — her tedarikçi (Account, type=Vendor) için ayrı stok kodu.</summary>
public class ProductSku
{
    public Guid Id { get; set; }

    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    /// <summary>Tedarikçi Platform Account'a referans (AccountType=Vendor olan kayıt).</summary>
    public Guid SupplierAccountId { get; set; }
    public Account SupplierAccount { get; set; } = null!;

    /// <summary>Tedarikçi bazlı stok kodu (maks 25 karakter)</summary>
    public string Sku { get; set; } = null!;
}
