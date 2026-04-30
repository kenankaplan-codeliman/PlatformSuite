using Platform.Domain.Entities.Common;
using CodePro.Domain.Enums;
using Platform.Domain.Enums;

namespace CodePro.Domain.Entities.PurchaseRequests;

/// <summary>
/// Satın Alma Talebi — header bilgisi; satırlar line-based onaylanır,
/// header status satır durumlarından rollup ile türetilir.
/// </summary>
public class PurchaseRequest :
    IBaseEntity,
    IAuditableEntity,
    IOwnedEntity,
    ISoftDeleteEntity
{
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;

    /// <summary>Kullanıcı elle girer; boşsa servis PR-YYYY-NNNN formatında üretir</summary>
    public string RequestNumber { get; set; } = null!;

    public string Title { get; set; } = null!;
    public string? Description { get; set; }

    public PurchaseRequestStatus Status { get; set; } = PurchaseRequestStatus.Setup;
    public PurchaseRequestPriority Priority { get; set; } = PurchaseRequestPriority.Medium;

    public DateTime RequestDate { get; set; } = DateTime.UtcNow;
    public DateTime? RequiredDate { get; set; }

    public string? CurrencyCode { get; set; }

    /// <summary>Satırların header currency'e parite uygulanmış toplamı — servis günceller</summary>
    public decimal TotalAmount { get; set; }

    // Navigation
    public ICollection<PurchaseRequestLine> Lines { get; } = new List<PurchaseRequestLine>();

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
