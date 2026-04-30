using Platform.Domain.Entities.Accounts;
using Platform.Domain.Entities.Common;
using CodePro.Domain.Entities.PurchaseRequests;
using CodePro.Domain.Enums;
using Platform.Domain.Enums;

namespace CodePro.Domain.Entities.PurchaseOrders;

/// <summary>
/// Satın Alma Siparişi — header bilgisi; satırlar line-based ilerler,
/// header status satır durumlarından rollup ile türetilir.
/// </summary>
public class PurchaseOrder :
    IBaseEntity,
    IAuditableEntity,
    IOwnedEntity,
    ISoftDeleteEntity
{
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;

    /// <summary>Otomatik üretilen sipariş numarası (PO-YYYY-NNNN)</summary>
    public string OrderNumber { get; set; } = null!;

    public string Title { get; set; } = null!;
    public string? Description { get; set; }

    /// <summary>Tedarikçi Platform Account'a referans (AccountType=Vendor).</summary>
    public Guid SupplierAccountId { get; set; }
    public Account SupplierAccount { get; set; } = null!;

    /// <summary>Bu siparişin kaynaklandığı talep (opsiyonel — elle oluşturulan siparişlerde null)</summary>
    public Guid? PurchaseRequestId { get; set; }
    public PurchaseRequest? PurchaseRequest { get; set; }

    public PurchaseOrderStatus Status { get; set; } = PurchaseOrderStatus.Draft;
    public PurchaseOrderPriority Priority { get; set; } = PurchaseOrderPriority.Medium;

    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public DateTime? ExpectedDeliveryDate { get; set; }

    public string? CurrencyCode { get; set; }

    /// <summary>Satırların header currency'e parite uygulanmış toplamı — servis günceller</summary>
    public decimal TotalAmount { get; set; }

    // Navigation
    public ICollection<PurchaseOrderLine> Lines { get; } = new List<PurchaseOrderLine>();

    // IOwnedEntity
    public Guid OwnerId { get; private set; }
    public Guid OrganizationId { get; private set; }

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
