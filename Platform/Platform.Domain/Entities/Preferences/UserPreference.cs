using Platform.Domain.Entities.Common;

namespace Platform.Domain.Entities.Preferences;

/// <summary>
/// Generic kullanıcı tercihi: (owner, preference_key) başına tek satır, opak JSON value.
/// Cross-cutting platform altyapısı — dashboard layout, kolon/filtre tercihleri vb. için
/// uygulama-bağımsız anahtar bazlı depo. Server value içeriğini yorumlamaz.
/// </summary>
public class UserPreference :
    IBaseEntity,
    IOwnedEntity,
    IAuditableEntity,
    ISoftDeleteEntity
{
    // IBaseEntity
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;

    /// <summary>Tercih anahtarı, örn. "dashboard.layout".</summary>
    public string PreferenceKey { get; set; } = null!;

    /// <summary>Opak JSON value.</summary>
    public string Value { get; set; } = null!;

    // IOwnedEntity — OwnerId tercihin sahibi kullanıcıdır.
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
