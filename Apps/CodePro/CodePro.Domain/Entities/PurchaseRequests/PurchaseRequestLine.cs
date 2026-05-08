using CodePro.Domain.Entities.Suppliers;
using Platform.Domain.Entities.Common;
using CodePro.Domain.Entities.Products;
using CodePro.Domain.Entities.PurchaseOrders;
using CodePro.Domain.Enums;
using Platform.Domain.Enums;

namespace CodePro.Domain.Entities.PurchaseRequests;

/// <summary>
/// Satın Alma Talebi Satırı — satır bazında onay akışı ile ilerler.
/// ProductId null ise free-text satırdır (product_name kullanılır).
/// </summary>
public class PurchaseRequestLine : IBaseEntity, IAuditableEntity, ISoftDeleteEntity
{
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;

    public Guid PurchaseRequestId { get; set; }
    public PurchaseRequest PurchaseRequest { get; set; } = null!;

    /// <summary>Serbest ürün (katalog dışı) — true ise ProductId null, ProductName zorunlu</summary>
    public bool IsFreeProduct { get; set; }

    /// <summary>Katalog ürünü (IsFreeProduct = false iken dolu)</summary>
    public Guid? ProductId { get; set; }
    public Product? Product { get; set; }

    /// <summary>Ürün adı — serbest ürünlerde elle girilir, katalogdan kopya da olabilir</summary>
    public string? ProductName { get; set; }

    /// <summary>Fiyat eşleşmesi başarılıysa ProductPrice.Id; aksi halde null</summary>
    public Guid? ProductPriceId { get; set; }
    public ProductPrice? ProductPrice { get; set; }

    /// <summary>Fiyat eşleşirse ProductPrice.SupplierId; yoksa kullanıcı manuel seçer (Platform Account, AccountType=Vendor).</summary>
    public Guid? SupplierId { get; set; }
    public Supplier? Supplier { get; set; }

    /// <summary>İstenen miktar — 3 ondalık</summary>
    public decimal Quantity { get; set; }

    public string? UnitOfMeasure { get; set; }
    public decimal? UnitPrice { get; set; }
    public string? Currency { get; set; }

    /// <summary>quantity * unit_price — servis hesaplar</summary>
    public decimal TotalAmount { get; set; }

    public DateTime? NeedByDate { get; set; }
    public string? BuyerNotes { get; set; }

    public PurchaseRequestLineStatus Status { get; set; } = PurchaseRequestLineStatus.Setup;

    // Bu talep satırından oluşturulan sipariş satır bağlantıları
    public ICollection<PurchaseOrderRequestLine> OrderRequestLines { get; } = new List<PurchaseOrderRequestLine>();

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
