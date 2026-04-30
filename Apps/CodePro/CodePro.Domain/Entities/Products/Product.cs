using Platform.Domain.Entities.Common;

namespace CodePro.Domain.Entities.Products;

public class Product :
    IBaseEntity,
    IAuditableEntity,
    ISoftDeleteEntity
{
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;

    /// <summary>Ürün kodu — alfanumeric, benzersiz (maks 25 karakter)</summary>
    public string Code { get; set; } = null!;

    /// <summary>Ürün başlığı (maks 50 karakter)</summary>
    public string Name { get; set; } = null!;

    /// <summary>Kısa açıklama (maks 50 karakter)</summary>
    public string ShortDescription { get; set; } = null!;

    /// <summary>Detaylı açıklama</summary>
    public string? DetailedDescription { get; set; }

    /// <summary>Geçerlilik başlangıç tarihi — bugünden küçük olamaz</summary>
    public DateTime ValidFrom { get; set; }

    /// <summary>Geçerlilik bitiş tarihi — ValidFrom'dan küçük olamaz</summary>
    public DateTime ValidUntil { get; set; }

    /// <summary>Ölçü birimi (ör: Adet, Kg, Metre)</summary>
    public string? UnitOfMeasure { get; set; }

    /// <summary>Üretici orijinal parça numarası (maks 25 karakter)</summary>
    public string? ManufacturerPartNumber { get; set; }

    /// <summary>Model bilgisi (maks 25 karakter)</summary>
    public string? Model { get; set; }

    /// <summary>Ürün rengi (maks 25 karakter)</summary>
    public string? Color { get; set; }

    /// <summary>Ürün URL adresi</summary>
    public string? ProductUrl { get; set; }

    /// <summary>Ölçü birimi başına adet (bilgi amaçlı)</summary>
    public int? QuantityPerUnit { get; set; }

    /// <summary>Ürün teslim gün sayısı (zorunlu)</summary>
    public int DeliveryDays { get; set; }

    /// <summary>Hesap kodu referansı (alıcı tanımlı)</summary>
    public Guid? AccountCodeId { get; set; }

    // Kategori (zorunlu)
    public Guid ProductCategoryId { get; set; }
    public ProductCategory ProductCategory { get; set; } = null!;

    // Navigation
    public ICollection<ProductBrand> ProductBrands { get; } = new List<ProductBrand>();
    public ICollection<ProductManufacturer> ProductManufacturers { get; } = new List<ProductManufacturer>();
    public ICollection<ProductKeyword> Keywords { get; } = new List<ProductKeyword>();
    public ICollection<ProductSku> SupplierSkus { get; } = new List<ProductSku>();

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
