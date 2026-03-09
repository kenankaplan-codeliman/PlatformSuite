using CRM.Domain.Entities.Common;
using CRM.Domain.Entities.Opportunities;
using CRM.Domain.Enums;
using System;
using System.Collections.Generic;

namespace CRM.Domain.Entities.Products;

public class Product :
    IBaseEntity,
    IAuditableEntity,
    ISoftDeleteEntity
{
    #region IBaseEntity
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;
    #endregion

    // ── Temel Bilgiler ────────────────────────────────────────────────────

    public string Name { get; set; } = default!;
    public string? Description { get; set; }

    /// <summary>Stok Tutma Birimi — benzersiz ürün kodu</summary>
    public string? SKU { get; set; }

    public ProductCategory Category { get; set; }

    // ── Fiyatlandırma ─────────────────────────────────────────────────────

    public decimal UnitPrice { get; set; }

    /// <summary>ISO 4217 para birimi kodu (ör: TRY, USD, EUR)</summary>
    public string Currency { get; set; } = "TRY";

    /// <summary>Birim adı (ör: Adet, Saat, Lisans, Ay)</summary>
    public string? Unit { get; set; }

    // ── İlişkiler ─────────────────────────────────────────────────────────

    public ICollection<OpportunityProduct> OpportunityProducts { get; set; } = new List<OpportunityProduct>();

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