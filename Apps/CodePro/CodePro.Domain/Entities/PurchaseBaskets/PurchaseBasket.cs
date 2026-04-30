using Platform.Domain.Entities.Common;
using CodePro.Domain.Entities.PurchaseRequests;
using CodePro.Domain.Enums;
using Platform.Domain.Enums;

namespace CodePro.Domain.Entities.PurchaseBaskets;

/// <summary>
/// Satın Alma Sepeti — kullanıcı PurchaseRequest oluşturmadan önce ürünleri
/// biriktirir. Kullanıcı başına yalnızca bir aktif (Preparing) sepet olabilir.
/// </summary>
public class PurchaseBasket :
    IBaseEntity,
    IAuditableEntity,
    IOwnedEntity,
    ISoftDeleteEntity
{
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;

    public PurchaseBasketStatus Status { get; set; } = PurchaseBasketStatus.Preparing;

    public Guid? PurchaseRequestId { get; set; }
    public PurchaseRequest? PurchaseRequest { get; set; }

    // Navigation
    public ICollection<PurchaseBasketLine> Lines { get; } = new List<PurchaseBasketLine>();

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
