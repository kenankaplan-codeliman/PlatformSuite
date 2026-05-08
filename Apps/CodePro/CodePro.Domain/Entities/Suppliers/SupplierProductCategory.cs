using CodePro.Domain.Entities.Products;
using Platform.Domain.Entities.Common;

namespace CodePro.Domain.Entities.Suppliers;

/// <summary>
/// Supplier ↔ ProductCategory N:N junction. Bir tedarikçinin hangi ürün
/// kategorilerinde faaliyet gösterdiğini bağlar.
/// </summary>
public class SupplierProductCategory : IBaseEntity, IAuditableEntity, ISoftDeleteEntity
{
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;

    public Guid SupplierId { get; set; }
    public Supplier Supplier { get; set; } = null!;

    public Guid ProductCategoryId { get; set; }
    public ProductCategory ProductCategory { get; set; } = null!;

    public bool IsPreferred { get; set; }

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
