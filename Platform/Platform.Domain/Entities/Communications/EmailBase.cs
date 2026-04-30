using Platform.Domain.Enums;
using Platform.Domain.Entities.Common;

namespace Platform.Domain.Entities.Communications;

public abstract class EmailBase : IBaseEntity, IAuditableEntity, ISoftDeleteEntity
{
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;

    public string Email { get; set; } = null!;
    public EmailType Type { get; set; }
    public bool IsPrimary { get; set; }

    public Guid CreatedBy { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public Guid? UpdatedBy { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public bool IsDeleted { get; private set; }
    public Guid? DeletedBy { get; private set; }
    public DateTime? DeletedAt { get; private set; }
}
