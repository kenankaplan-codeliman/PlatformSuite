namespace CRM.Application.Modals.Common;

/// <summary>
/// Kayıt sahibi, oluşturan ve güncelleyen bilgilerini taşır.
/// TypeScript tarafındaki AuditInfo interface'inin C# karşılığıdır.
/// </summary>
public class AuditInfo
{
    /// <summary>Kaydın sahibi (IOwnedEntity.OwnerId)</summary>
    public EntityReference? Owner { get; set; }

    /// <summary>Kaydı oluşturan kullanıcı (IAuditableEntity.CreatedBy)</summary>
    public EntityReference? CreatedBy { get; set; }

    /// <summary>Oluşturulma tarihi (IAuditableEntity.CreatedAt)</summary>
    public DateTime? CreatedAt { get; set; }

    /// <summary>Son güncelleyen kullanıcı (IAuditableEntity.UpdatedBy)</summary>
    public EntityReference? UpdatedBy { get; set; }

    /// <summary>Son güncelleme tarihi (IAuditableEntity.UpdatedAt)</summary>
    public DateTime? UpdatedAt { get; set; }
}