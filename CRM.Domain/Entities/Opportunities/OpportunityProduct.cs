using CRM.Domain.Entities.Common;
using System;

namespace CRM.Domain.Entities.Opportunities;

/// <summary>
/// Opportunity ile Product arasındaki many-to-many ilişki tablosu.
/// Her satır bir fırsattaki ürün/hizmet kalemini temsil eder.
/// </summary>
public class OpportunityProduct : IBaseEntity, IAuditableEntity
{
    #region IBaseEntity
    public Guid Id { get; set; }
    public bool IsActive { get; set; } = true;
    #endregion

    // ── İlişkiler ─────────────────────────────────────────────────────────

    public Guid OpportunityId { get; set; }
    public Opportunity Opportunity { get; set; } = default!;

    public Guid ProductId { get; set; }
    public Products.Product Product { get; set; } = default!;

    // ── Kalem Bilgileri ───────────────────────────────────────────────────

    public int Quantity { get; set; } = 1;

    /// <summary>Satış anındaki birim fiyat (Product.UnitPrice override edilebilir)</summary>
    public decimal UnitPrice { get; set; }

    /// <summary>İndirim yüzdesi (0–100)</summary>
    public decimal DiscountPercent { get; set; } = 0;

    /// <summary>Sabit indirim tutarı (yüzde yerine kullanılabilir)</summary>
    public decimal DiscountAmount { get; set; } = 0;

    /// <summary>Kalem açıklaması veya notu</summary>
    public string? Description { get; set; }

    // ── Hesaplanan Alan ───────────────────────────────────────────────────
    /// <summary>
    /// Toplam tutar: (Quantity * UnitPrice) - DiscountAmount - (Quantity * UnitPrice * DiscountPercent / 100)
    /// </summary>
    public decimal TotalPrice { get; set; }

    // ── IAuditableEntity ──────────────────────────────────────────────────

    public Guid CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
}