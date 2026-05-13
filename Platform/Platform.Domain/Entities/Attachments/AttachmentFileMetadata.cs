using Platform.Domain.Entities.Common;

namespace Platform.Domain.Entities.Attachments;

/// <summary>
/// Dosyaya ait meta veriler. Binary data olmadan okunabilir.
/// </summary>
public class AttachmentFileMetadata : IBaseEntity, IOwnedEntity, IAuditableEntity, ISoftDeleteEntity
{
    // IBaseEntity
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;

    public Guid FileDataId { get; set; }
    public string FileName { get; set; } = null!;
    public string ContentType { get; set; } = null!;
    public long FileSize { get; set; }

    // App-tarafında validate edilen serbest string (örn. "Other",
    // "TicaretSicilGazetesi", "Sozlesme"). Platform.Domain enum tutmaz.
    public string DocumentType { get; set; } = "Other";
    public string? Subject { get; set; }
    public string? Description { get; set; }

    /// <summary>
    /// Draft attachment için TTL. AssociateAsync çağrıldığında NULL olur.
    /// Süresi geçenler AttachmentCleanupService tarafından silinir.
    /// </summary>
    public DateTime? ExpiresAt { get; set; }

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

    // Navigation
    public AttachmentFileData FileData { get; set; } = null!;
    public ICollection<AttachmentFileRelation> Relations { get; } = new List<AttachmentFileRelation>();
}
