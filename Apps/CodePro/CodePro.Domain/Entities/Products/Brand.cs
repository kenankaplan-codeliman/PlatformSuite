using Platform.Domain.Entities.Common;

namespace CodePro.Domain.Entities.Products;

/// <summary>Ürün markası — merkezi marka listesi</summary>
public class Brand : IBaseEntity, IAuditableEntity, ISoftDeleteEntity
{
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;

    public string Name { get; set; } = null!;

    // Navigation
    public ICollection<ProductBrand> ProductBrands { get; } = new List<ProductBrand>();

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
