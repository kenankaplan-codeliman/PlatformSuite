using Platform.Domain.Entities.Common;

namespace CodePro.Domain.Entities.Products;

public class ProductCatalog :
    IBaseEntity,
    IAuditableEntity,
    ISoftDeleteEntity
{
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;

    /// <summary>Katalog kodu — benzersiz, zorunlu (maks 25 karakter)</summary>
    public string Code { get; set; } = null!;

    /// <summary>Katalog adı — zorunlu (maks 100 karakter)</summary>
    public string Name { get; set; } = null!;

    /// <summary>Katalog açıklaması — serbest metin</summary>
    public string? Description { get; set; }

    /// <summary>Geçerlilik başlangıç tarihi — saat bilgisi tutulmaz</summary>
    public DateTime ValidFrom { get; set; }

    /// <summary>Geçerlilik bitiş tarihi — saat bilgisi tutulmaz</summary>
    public DateTime ValidUntil { get; set; }

    /// <summary>Fiyat kodu — serbest metin</summary>
    public string? PriceCode { get; set; }

    // Navigation
    public ICollection<ProductCatalogProduct> CatalogProducts { get; } = new List<ProductCatalogProduct>();
    public ICollection<ProductCatalogOrganization> CatalogOrganizations { get; } = new List<ProductCatalogOrganization>();

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
