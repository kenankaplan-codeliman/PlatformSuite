using Platform.Domain.Entities.Common;

namespace CodePro.Domain.Entities.Products;

public class ProductImage : IAuditableEntity, ISoftDeleteEntity
{
    public Guid Id { get; set; }

    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public string FileName { get; set; } = null!;
    public string ContentType { get; set; } = null!;
    public long FileSize { get; set; }
    public byte[] ImageBytes { get; set; } = null!;
    public byte[] ThumbnailBytes { get; set; } = null!;

    public int SortOrder { get; set; }
    public bool IsDefault { get; set; }

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
