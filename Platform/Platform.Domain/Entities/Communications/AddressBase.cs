using Platform.Domain.Enums;
using Platform.Domain.Entities.Common;

namespace Platform.Domain.Entities.Communications;

public abstract class AddressBase : IBaseEntity, IAuditableEntity, ISoftDeleteEntity
{
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;

    public string AddressLine1 { get; set; } = null!;
    public string? AddressLine2 { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? PostalCode { get; set; }
    public string? Country { get; set; }

    public AddressType Type { get; set; }
    public bool IsPrimary { get; set; }

    public Guid CreatedBy { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public Guid? UpdatedBy { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public bool IsDeleted { get; private set; }
    public Guid? DeletedBy { get; private set; }
    public DateTime? DeletedAt { get; private set; }
}
