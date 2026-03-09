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
    public bool IsActive { get; private set; } = true;
    #endregion

    // ── İlişkiler ─────────────────────────────────────────────────────────

    public Guid OpportunityId { get; set; }
    public Opportunity Opportunity { get; set; } = default!;

    public Guid ProductId { get; set; }
    public Products.Product Product { get; set; } = default!;
    

    // ── IAuditableEntity ──────────────────────────────────────────────────

    public Guid CreatedBy { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public Guid? UpdatedBy { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
}