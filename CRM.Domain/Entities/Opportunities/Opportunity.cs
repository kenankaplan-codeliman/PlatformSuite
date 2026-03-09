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
    public bool IsActive { get; private set; } = true;
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

    #region IOwnedEntity
    public Guid OwnerId { get; private set; }
    public Guid OrganizationId { get; private set; }
    #endregion

    // ── IAuditableEntity ──────────────────────────────────────────────────

    public Guid CreatedBy { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public Guid? UpdatedBy { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    // ── ISoftDeleteEntity ─────────────────────────────────────────────────

    public bool IsDeleted { get; private set; }
    public Guid? DeletedBy { get; private set; }
    public DateTime? DeletedAt { get; private set; }
}