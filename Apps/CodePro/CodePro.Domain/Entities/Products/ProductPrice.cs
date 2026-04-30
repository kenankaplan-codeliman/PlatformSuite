using Platform.Domain.Entities.Accounts;
using Platform.Domain.Entities.Common;

namespace CodePro.Domain.Entities.Products;

public class ProductPrice : IBaseEntity, IAuditableEntity, ISoftDeleteEntity
{
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;

    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    /// <summary>Tedarikçi Platform Account'a referans (AccountType=Vendor).</summary>
    public Guid SupplierAccountId { get; set; }
    public Account SupplierAccount { get; set; } = null!;

    public Guid? PriceListId { get; set; }
    public PriceList? PriceList { get; set; }

    /// <summary>Barem ve minimum sipariş için kullanılır</summary>
    public decimal MinimumQuantity { get; set; }

    /// <summary>Fiyat ilk geçerlilik tarihi</summary>
    public DateTime ValidFrom { get; set; }

    /// <summary>Fiyat son geçerlilik tarihi</summary>
    public DateTime ValidUntil { get; set; }

    /// <summary>Birim fiyat</summary>
    public decimal UnitPrice { get; set; }

    /// <summary>Para birimi (ISO 4217 — örn: TRY, USD, EUR)</summary>
    public string Currency { get; set; } = null!;

    // Audit
    public Guid CreatedBy { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public Guid? UpdatedBy { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    // Soft Delete
    public bool IsDeleted { get; private set; }
    public Guid? DeletedBy { get; private set; }
    public DateTime? DeletedAt { get; private set; }
}
