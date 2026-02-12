using Crm.Domain.Enums;
using CRM.Domain.Entities.Common;
using CRM.Domain.Enums;

namespace CRM.Domain.Entities.Accounts;

public class AccountEmail : IBaseEntity, IAuditableEntity, ISoftDeleteEntity
{
    // IBaseEntity
    public Guid Id { get; set; }
    public bool IsActive { get; set; } = true;

    public Guid AccountId { get; set; }
    public Account Account { get; set; } = null!;

    public string Email { get; set; } = null!;
    public EmailType Type { get; set; }
    public bool IsPrimary { get; set; }

    // Audit
    public Guid CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }

    // Soft Delete
    public bool IsDeleted { get; set; }
    public Guid? DeletedBy { get; set; }
    public DateTime? DeletedAt { get; set; }
}