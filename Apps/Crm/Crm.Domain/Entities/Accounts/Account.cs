using Platform.Domain.Entities.Activities;
using Platform.Domain.Entities.Common;

namespace Crm.Domain.Entities.Accounts;

public class Account :
    IBaseEntity,
    IOwnedEntity,
    IAuditableEntity,
    ISoftDeleteEntity
{
    // IBaseEntity
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;

    public string AccountName { get; set; } = null!;

    // GeneralParameter'a taşındı — code olarak string tutulur.
    // parentCode: AccountParameterCodes.Type / AccountParameterCodes.Status
    public string AccountType { get; set; } = "Customer";
    public string AccountStatus { get; set; } = "Prospect";
    public string? Industry { get; set; }
    public decimal? AnnualRevenue { get; set; }
    public int? NumberOfEmployees { get; set; }
    public string? Website { get; set; }
    public string? Description { get; set; }

    // Self-referencing relationship
    public Guid? ParentAccountId { get; set; }
    public Account? ParentAccount { get; set; }
    public ICollection<Account> ChildAccounts { get; } = new List<Account>();

    #region IOwnedEntity
    public Guid OwnerId { get; private set; }
    public Guid OrganizationId { get; private set; }
    #endregion

    // Navigation
    // Email/Phone/Address artık aggregate navigation değil — polimorfik owner ile
    // crm_email/crm_phone/crm_address tablolarında yaşar (ParentEntityType="Account").
    // ICommunicationRepository üzerinden yüklenir/senkronlanır.
    public ICollection<AccountContact> AccountContacts { get; } = new List<AccountContact>();

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