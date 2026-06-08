using Crm.Domain.Entities.Accounts;
using Platform.Domain.Entities.Common;
using Crm.Domain.Entities.Contacts;

namespace Crm.Domain.Entities.Leads;

public class Lead :
    IBaseEntity,
    IOwnedEntity,
    IAuditableEntity,
    ISoftDeleteEntity
{
    // IBaseEntity
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;

    public string Subject { get; set; } = null!;

    // Kişi bilgisi (Convert sırasında Contact'a taşınır)
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Title { get; set; }
    public string? Department { get; set; }

    // Firma bilgisi (Convert sırasında Account'a taşınır)
    public string? Company { get; set; }
    public string? Industry { get; set; }
    public string? Website { get; set; }

    // İletişim (email/telefon/adres) artık polimorfik Communications modelinde
    // (parent_entity_type = "Lead") tutulur — düz Email/Phone alanları kaldırıldı.
    // Account/Contact ile aynı veri modeli; Convert sırasında bire bir kopyalanır.

    // GeneralParameter'a taşındı — code olarak string tutulur.
    // parentCode: LeadParameterCodes.Source / LeadParameterCodes.Status
    public string Source { get; set; } = "Other";
    public string Status { get; set; } = "New";
    // Sınıflandırma — GeneralParameter code (parentCode: LeadParameterCodes.Rating → Hot/Warm/Cold).
    public string? Rating { get; set; }
    public int? Score { get; set; }
    public decimal? EstimatedValue { get; set; }
    // EstimatedValue'nun para birimi — GeneralParameter code (parentCode: CurrencyType).
    public string? EstimatedValueCurrency { get; set; }
    public string? Description { get; set; }

    // Convert sırasında (Status → Converted) doldurulur — Lead'i Account/Contact/Opportunity'e bağlar.
    public Guid? ConvertedAccountId { get; set; }
    public Account? ConvertedAccount { get; set; }
    public Guid? ConvertedContactId { get; set; }
    public Contact? ConvertedContact { get; set; }
    public DateTime? ConvertedAt { get; set; }

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
