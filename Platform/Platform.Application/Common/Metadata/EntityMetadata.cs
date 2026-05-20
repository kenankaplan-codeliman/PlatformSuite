using Platform.Application.Modals.Common;

namespace Platform.Application.Common.Metadata;

/// <summary>
/// Tüm entity'lerde ortak olan cross-cutting bilgiler (IBaseEntity / IOwnedEntity /
/// IAuditableEntity). Entity'ye özel Detail DTO'larından bağımsız; tek bir generic
/// endpoint (api/entity-metadata/get) üzerinden, entity tipinden bağımsız okunur.
/// Owner/Organization/CreatedBy/UpdatedBy EntityReference olarak çözülür (ham Guid değil).
/// </summary>
public sealed class EntityMetadata
{
    public bool IsActive { get; set; }

    public EntityReference? Owner { get; set; }
    public EntityReference? Organization { get; set; }

    public EntityReference? CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public EntityReference? UpdatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
