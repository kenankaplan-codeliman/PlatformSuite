using Crm.Domain.Entities.Accounts;
using Platform.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.Text;
using System.Xml.Linq;

namespace Crm.Domain.Entities.Contacts;

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
    // GeneralParameter'a taşındı — code olarak string tutulur.
    // parentCode: ContactParameterCodes.Status
    public string ContactStatus { get; set; } = "Active";

    public string? Title { get; set; }
    public string? Department { get; set; }
    public DateTime? BirthDate { get; set; }
    public string? Description { get; set; }

    #region IOwnedEntity
    public Guid OwnerId { get; private set; }
    public Guid OrganizationId { get; private set; }
    #endregion

    // Email/Phone/Address artık aggregate navigation değil — polimorfik owner ile
    // crm_email/crm_phone/crm_address tablolarında yaşar (ParentEntityType="Contact").
    public ICollection<AccountContact> AccountContacts { get;} = new List<AccountContact>();

    public Guid CreatedBy { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public Guid? UpdatedBy { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public bool IsDeleted { get; private set; }
    public Guid? DeletedBy { get; private set; }
    public DateTime? DeletedAt { get; private set; }
}
