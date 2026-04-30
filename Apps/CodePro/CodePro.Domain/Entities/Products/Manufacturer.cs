using Platform.Domain.Entities.Common;

namespace CodePro.Domain.Entities.Products;

/// <summary>Ürün üreticisi — merkezi üretici listesi</summary>
public class Manufacturer : IBaseEntity, IAuditableEntity, ISoftDeleteEntity
{
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;

    public string Name { get; set; } = null!;

    // Navigation
    public ICollection<ProductManufacturer> ProductManufacturers { get; } = new List<ProductManufacturer>();

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
