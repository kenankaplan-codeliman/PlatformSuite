using CRM.Domain.Entities.Accounts;
using CRM.Domain.Entities.Common;
using CRM.Domain.Entities.Contacts;
using CRM.Domain.Enums;
using System;


namespace CRM.Domain.Entities.Opportunities;

public class Opportunity :
    IBaseEntity,
    IAuditableEntity,
    IOwnedEntity,
    ISoftDeleteEntity
{
    #region IBaseEntity
    public Guid Id { get; set; }
    public bool IsActive { get; set; } = true;
    #endregion

    // ── Temel Bilgiler ────────────────────────────────────────────────────

    public string Name { get; set; } = default!;
    public string? Description { get; set; }

    // ── Finansal Bilgiler ─────────────────────────────────────────────────

    /// <summary>Tahmini fırsat değeri</summary>
    public decimal EstimatedValue { get; set; }

    /// <summary>Kapanış sonrası gerçekleşen değer (Closed Won)</summary>
    public decimal? ActualValue { get; set; }

    /// <summary>ISO 4217 para birimi kodu (ör: TRY, USD, EUR)</summary>
    public string Currency { get; set; } = "TRY";

    // ── Aşama & Tahmin ────────────────────────────────────────────────────

    public OpportunityStage Stage { get; set; }

    /// <summary>Kazanma olasılığı (0–100)</summary>
    public int Probability { get; set; }

    public DateTime? CloseDate { get; set; }

    // ── Kaynak ────────────────────────────────────────────────────────────

    public OpportunitySource? Source { get; set; }

    // ── İlişkiler ─────────────────────────────────────────────────────────

    public Guid AccountId { get; set; }
    public Account Account { get; set; } = default!;

    /// <summary>Fırsatla ilişkili birincil kişi</summary>
    public Guid? ContactId { get; set; }
    public Contact? Contact { get; set; }

    /// <summary>Fırsata eklenen ürün/hizmet kalemleri</summary>
    public ICollection<OpportunityProduct> OpportunityProducts { get; set; } = new List<OpportunityProduct>();

    // ── IOwnedEntity ──────────────────────────────────────────────────────

    public Guid OwnerId { get; set; }
    public Guid OrganizationId { get; set; }

    // ── IAuditableEntity ──────────────────────────────────────────────────

    public Guid CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }

    // ── ISoftDeleteEntity ─────────────────────────────────────────────────

    public bool IsDeleted { get; set; }
    public Guid? DeletedBy { get; set; }
    public DateTime? DeletedAt { get; set; }
}