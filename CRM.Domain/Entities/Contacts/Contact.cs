using CRM.Domain.Entities.Accounts;
using CRM.Domain.Entities.Common;
using CRM.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;
using System.Xml.Linq;

namespace CRM.Domain.Entities.Contacts;

public class Contact :
    IBaseEntity,
    IAuditableEntity,
    IOwnedEntity,
    ISoftDeleteEntity
{
    #region IBaseEntity
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;
    #endregion

    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string DisplayName => $"{FirstName} {LastName}";

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

    public Guid CreatedBy { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public Guid? UpdatedBy { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public bool IsDeleted { get; private set; }
    public Guid? DeletedBy { get; private set; }
    public DateTime? DeletedAt { get; private set; }
}
