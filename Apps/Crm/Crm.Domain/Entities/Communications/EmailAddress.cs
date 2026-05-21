using Crm.Domain.Enums;
using Platform.Domain.Entities.Common;

namespace Crm.Domain.Entities.Communications;

public class EmailAddress : ICommunication, IBaseEntity, IAuditableEntity, ISoftDeleteEntity
{
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;

    // Polimorfik owner — "Account" | "Contact" | ...
    public string ParentEntityType { get; set; } = null!;
    public Guid ParentEntityId { get; set; }

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
