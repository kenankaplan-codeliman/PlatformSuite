using Crm.Domain.Enums;
using CRM.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Domain.Entities.Contacts;

public class ContactPhone : IBaseEntity, IAuditableEntity, ISoftDeleteEntity
{

    #region IBaseEntity
    public Guid Id { get; set; }
    public bool IsActive { get; set; } = true;
    #endregion

    public Guid ContactId { get; set; }
    public Contact Contact { get; set; } = null!;

    public string PhoneNumber { get; set; } = default!;
    public PhoneType Type { get; set; }
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
