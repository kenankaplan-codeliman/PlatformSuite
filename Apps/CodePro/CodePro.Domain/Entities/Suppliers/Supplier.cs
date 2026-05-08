using CodePro.Domain.Enums;
using Platform.Domain.Entities.Common;

namespace CodePro.Domain.Entities.Suppliers;

/// <summary>
/// CodePro tedarikçi entity'si. CRM Account'undan bağımsızdır; satın alma
/// uygulamasının kendi yaşam döngüsü, durumları ve niteliklerine sahiptir.
/// Tek kurumsal iletişim kişisi düz alanlarla tutulur (ContactPersonName/Email/Phone);
/// çoklu kişi/iletişim ihtiyacı çıkarsa ileride ayrı entity'ler eklenir.
/// </summary>
public class Supplier :
    IBaseEntity,
    IOwnedEntity,
    IAuditableEntity,
    ISoftDeleteEntity
{
    // IBaseEntity
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;

    // Kurumsal kimlik
    public string Name { get; set; } = null!;
    public string? Industry { get; set; }
    public string? Website { get; set; }
    public string? Description { get; set; }
    public decimal? AnnualRevenue { get; set; }
    public int? NumberOfEmployees { get; set; }

    // Tedarikçi profili
    public SupplierType SupplierType { get; set; }
    public SupplierStatus SupplierStatus { get; set; } = SupplierStatus.Pending;
    public CompanyType CompanyType { get; set; }
    public CompanyLegalType? CompanyLegalType { get; set; }
    public string? TaxOffice { get; set; }
    public string? Vkn { get; set; }
    public string? MersisNo { get; set; }

    // İletişim kişisi (düz alanlar — tek kişi yeterli)
    public string? ContactPersonName { get; set; }
    public string? ContactPersonEmail { get; set; }
    public string? ContactPersonPhone { get; set; }

    // Kurumsal adres (düz)
    public string? AddressLine { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? PostalCode { get; set; }

    // IOwnedEntity
    public Guid OwnerId { get; private set; }
    public Guid OrganizationId { get; private set; }

    // Navigation
    public ICollection<SupplierProductCategory> ProductCategories { get; } = new List<SupplierProductCategory>();

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
