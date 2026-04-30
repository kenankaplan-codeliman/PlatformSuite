using Platform.Domain.Entities.Common;
using CodePro.Domain.Entities.Products;

namespace CodePro.Domain.Entities.PurchaseBaskets;

public class PurchaseBasketLine : IBaseEntity, IAuditableEntity, ISoftDeleteEntity
{
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;

    public Guid PurchaseBasketId { get; set; }
    public PurchaseBasket PurchaseBasket { get; set; } = null!;

    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    /// <summary>İstenen adet (>0)</summary>
    public int Quantity { get; set; }

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
