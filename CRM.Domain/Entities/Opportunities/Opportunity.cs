using CRM.Domain.Entities.Accounts;
using CRM.Domain.Entities.Common;
using CRM.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Domain.Entities.Opportunities;

public class Opportunity :
    IBaseEntity,
    IAuditableEntity,
    IOwnedEntity,
    ISoftDeleteEntity
{
    #region IBaseEntity
    public Guid Id { get; set; }
    public bool IsActive { get; set; } = true;
    #endregion

    public string Name { get; set; }
    public decimal EstimatedValue { get; set; }
    public DateTime? CloseDate { get; set; }
    public OpportunityStage Stage { get; set; }
    public int Probability { get; set; }

    public Guid AccountId { get; set; }
    public Account Account { get; set; }

    public Guid OwnerId { get; set; }
    public Guid OrganizationId { get; set; }

    public Guid CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public bool IsDeleted { get; set; }
    public Guid? DeletedBy { get; set; }
    public DateTime? DeletedAt { get; set; }
}
