using CRM.Domain.Entities.Accounts;
using CRM.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Domain.Entities.Contacts;

public class Contact :
    IBaseEntity,
    IAuditableEntity,
    IOwnedEntity,
    ISoftDeleteEntity
{
    #region IBaseEntity
    public Guid Id { get; set; }
    public bool IsActive { get; set; } = true;
    #endregion

    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string? Title { get; set; }
    public string? Department { get; set; }
    public DateTime? BirthDate { get; set; }
    public string? Description { get; set; }

    #region IOwnedEntity
    public Guid OwnerId { get; private set; }
    public Guid OrganizationId { get; private set; }
    #endregion

    public ICollection<AccountContact> AccountContacts { get;} = new List<AccountContact>();
    public ICollection<ContactEmail> Emails { get;} = new List<ContactEmail>();
    public ICollection<ContactPhone> Phones { get;} = new List<ContactPhone>();
    public ICollection<ContactAddress> Addresses { get; } = new List<ContactAddress>();

    public Guid CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public bool IsDeleted { get; set; }
    public Guid? DeletedBy { get; set; }
    public DateTime? DeletedAt { get; set; }
}
