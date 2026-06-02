using Crm.Domain.Entities.Accounts;
using Platform.Domain.Entities.Common;
using Crm.Domain.Entities.Contacts;

namespace Crm.Domain.Entities.Opportunities;

public class Opportunity :
    IBaseEntity,
    IOwnedEntity,
    IAuditableEntity,
    ISoftDeleteEntity
{
    // IBaseEntity
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;

    public string Name { get; set; } = null!;
    public string? Description { get; set; }

    // İlişkili Firma (zorunlu) ve birincil İletişim (opsiyonel).
    public Guid AccountId { get; set; }
    public Account? Account { get; set; }
    public Guid? PrimaryContactId { get; set; }
    public Contact? PrimaryContact { get; set; }

    public string Stage { get; set; } = "Prospecting";
    /// <summary>Tahmini tutar — kullanıcı tarafından girilir.</summary>
    public decimal? EstimatedAmount { get; set; }
    /// <summary>Deal-level para birimi (GeneralParameter code, parentCode: CurrencyType).
    /// EstimatedAmount, ActualAmount ve tüm OpportunityProduct satırları bu currency'dedir
    /// — multi-currency line item DEĞİL (FX dönüşümü kapsam dışı).</summary>
    public string? Currency { get; set; }
    /// <summary>Gerçekleşen tutar — Products satır toplamlarının toplamından
    /// hesaplanır (LineTotal = Quantity * UnitPrice). Tüm satırlar Opportunity.Currency'de
    /// olduğu için toplam matematiksel olarak anlamlıdır. Save sırasında handler/mapping
    /// tarafından otomatik yazılır; client'tan gelen değer yok sayılır.</summary>
    public decimal? ActualAmount { get; set; }

    /// <summary>Gerçekleşen NET tutar — satırların NetAmount toplamı (oran+tutar indirim
    /// uygulanmış hali). Save sırasında handler/mapping tarafından yazılır; client değeri
    /// yok sayılır.</summary>
    public decimal? ActualNetAmount { get; set; }

    /// <summary>Tüm satırların indirim tutarlarının toplamı (oran cinsinden + tutar cinsinden
    /// indirimin para birimi cinsinden toplamı). Save sırasında handler/mapping tarafından
    /// yazılır; client değeri yok sayılır.</summary>
    public decimal? TotalDiscountAmount { get; set; }

    /// <summary>Fırsat seviyesindeki efektif indirim oranı:
    /// <c>TotalDiscountAmount / ActualAmount × 100</c>. Yüzde olarak (0-100). ActualAmount
    /// 0 veya null ise null. Save sırasında handler/mapping tarafından yazılır; client
    /// değeri yok sayılır.</summary>
    public decimal? TotalDiscountRate { get; set; }
    public int Probability { get; set; }
    public DateTime? CloseDate { get; set; }
    public string? LossReason { get; set; }

    // Satır kalemleri (aggregate child).
    public ICollection<OpportunityProduct> Products { get; } = new List<OpportunityProduct>();

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
