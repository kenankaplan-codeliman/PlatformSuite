using CRM.Domain.Entities.Activities;
using CRM.Domain.Entities.Common;
using CRM.Domain.Enums;

namespace CRM.Domain.Entities.Accounts;

public class Account :
    IBaseEntity,
    IOwnedEntity,
    IAuditableEntity,
    ISoftDeleteEntity
{
    // IBaseEntity
    public Guid Id { get; set; }
    public bool IsActive { get; set; } = true;

    public string AccountName { get; set; } = null!;
    public AccountType AccountType { get; set; }
    public string? Industry { get; set; }
    public decimal? AnnualRevenue { get; set; }
    public int? NumberOfEmployees { get; set; }
    public string? Website { get; set; }
    public string? Description { get; set; }

    // Self-referencing relationship
    public Guid? ParentAccountId { get; set; }
    public Account? ParentAccount { get; set; }
    public ICollection<Account> ChildAccounts { get; } = new List<Account>();

    // Multi Tenant
    public Guid OwnerId { get; set; }
    public Guid OrganizationId { get; set; }

    // Navigation
    public virtual ICollection<AccountEmail> Emails { get; } = new List<AccountEmail>();
    public ICollection<AccountPhone> Phones { get; } = new List<AccountPhone>();
    public ICollection<AccountAddress> Addresses { get; } = new List<AccountAddress>();
    public ICollection<AccountContact> AccountContacts { get; } = new List<AccountContact>();

    //public ICollection<Opportunity> Opportunities { get; } = new List<Opportunity>();
    //Helper Method
    public void AddEmail(AccountEmail email) {
        email.AccountId = Id;
        Emails.Add(email);
    }



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