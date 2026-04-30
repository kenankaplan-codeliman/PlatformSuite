using Platform.Domain.Entities.Common;

namespace CodePro.Domain.Entities.Products;

/// <summary>
/// Ürün Kategorisi — Ürünleri gruplar. (Tedarikçi N:N ilişkisi kaldırıldı; tedarikçi
/// artık Platform Account (AccountType=Vendor) — kategoriyle ilişki gerekirse
/// account_category gibi ayrı bir join entity ile gelecek revizyonlarda eklenir.)
/// </summary>
public class ProductCategory : IBaseEntity, IAuditableEntity, ISoftDeleteEntity
{
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;

    public string Name { get; set; } = null!;

    /// <summary>Hiyerarşik tam başlık: {ÜstKategori} \ {AltKategori} \ {Ad}</summary>
    public string Title { get; set; } = null!;

    /// <summary>Kısa kod (ör: "BT", "OFC", "YED")</summary>
    public string? Code { get; set; }

    public string? Description { get; set; }

    /// <summary>Hiyerarşik alt kategori desteği (opsiyonel)</summary>
    public Guid? ParentCategoryId { get; set; }
    public ProductCategory? ParentCategory { get; set; }
    public ICollection<ProductCategory> ChildCategories { get; } = new List<ProductCategory>();

    // Navigation
    public ICollection<Product> Products { get; } = new List<Product>();

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
