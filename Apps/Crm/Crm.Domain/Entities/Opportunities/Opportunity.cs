using Crm.Domain.Enums;
using Crm.Domain.Entities.Accounts;
using Platform.Domain.Entities.Common;
using Crm.Domain.Entities.Contacts;

namespace Crm.Domain.Entities.Opportunities;

public class Opportunity :
    IBaseEntity,
    IOwnedEntity,
    IAuditableEntity,
    ISoftDeleteEntity
{
    // IBaseEntity
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;

    public string Name { get; set; } = null!;
    public string? Description { get; set; }

    // İlişkili Firma (zorunlu) ve birincil İletişim (opsiyonel).
    public Guid AccountId { get; set; }
    public Account? Account { get; set; }
    public Guid? PrimaryContactId { get; set; }
    public Contact? PrimaryContact { get; set; }

    public OpportunityStage Stage { get; set; } = OpportunityStage.Prospecting;
    public decimal? Amount { get; set; }
    public int Probability { get; set; }
    public DateTime? CloseDate { get; set; }
    public string? LossReason { get; set; }

    // IOwnedEntity
    public Guid OwnerId { get; private set; }
    public Guid OrganizationId { get; private set; }

    // IAuditableEntity
    public Guid CreatedBy { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public Guid? UpdatedBy { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    // ISoftDeleteEntity
    public bool IsDeleted { get; private set; }
    public Guid? DeletedBy { get; private set; }
    public DateTime? DeletedAt { get; private set; }
}
