using Platform.Domain.Entities.Common;
using CodePro.Domain.Entities.PurchaseRequests;

namespace CodePro.Domain.Entities.PurchaseOrders;

/// <summary>
/// PurchaseOrderLine ↔ PurchaseRequestLine junction
/// Bir sipariş satırı birden fazla talep satırından oluşabilir.
/// </summary>
public class PurchaseOrderRequestLine : IBaseEntity
{
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;

    public Guid PurchaseOrderLineId { get; set; }
    public PurchaseOrderLine PurchaseOrderLine { get; set; } = null!;

    public Guid PurchaseRequestLineId { get; set; }
    public PurchaseRequestLine PurchaseRequestLine { get; set; } = null!;

    /// <summary>Bu talep satırından bu sipariş satırına aktarılan miktar — 3 ondalık</summary>
    public decimal AllocatedQuantity { get; set; }
}
