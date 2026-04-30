using Platform.Domain.Entities.Accounts;
using Platform.Domain.Entities.Common;

namespace CodePro.Domain.Entities.Products;

/// <summary>
/// Fiyat listesi — tedarikçi (Platform Account, type=Vendor) bazlı ürün fiyatlarını gruplayan başlık kayıt.
/// </summary>
public class PriceList :
    IBaseEntity,
    IAuditableEntity,
    ISoftDeleteEntity
{
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;

    /// <summary>Liste kodu — boş gelirse servis PL-YYYY-NNNN formatında üretir</summary>
    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;
    public string? Description { get; set; }

    /// <summary>Tedarikçi Platform Account'a referans.</summary>
    public Guid SupplierAccountId { get; set; }
    public Account SupplierAccount { get; set; } = null!;

    public ICollection<ProductPrice> Prices { get; } = new List<ProductPrice>();

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
