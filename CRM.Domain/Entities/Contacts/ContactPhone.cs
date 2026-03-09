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
    public bool IsActive { get; private set; } = true;
    #endregion

    public Guid ContactId { get; set; }
    public Contact Contact { get; set; } = null!;

    public string PhoneNumber { get; set; } = default!;
    public PhoneType Type { get; set; }
    public bool IsPrimary { get; set; }

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
