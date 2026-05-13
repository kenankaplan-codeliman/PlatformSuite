using Platform.Application.Modals.Common;

namespace Platform.Application.Features.AppUsers.Dtos;

public class AppUserDetailItem
{
    public Guid Id { get; set; }
    public string Email { get; set; } = default!;
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string? PhoneNumber { get; set; }

    /// <summary>
    /// EntityReference — frontend EntityLookupField doğrudan bu shape'i tüketir.
    /// Name hiyerarşik <c>Title</c>'a öncelik verir, fallback <c>OrganizationName</c>.
    /// </summary>
    public EntityReference? Organization { get; set; }

    /// <summary>EntityReference (User) — null ise kullanıcının yöneticisi yok (root).</summary>
    public EntityReference? Manager { get; set; }

    /// <summary>
    /// Kullanıcının atanmış rolleri. EntityReference shape (entityType="AppRole").
    /// Detail page'de EntityLookupField multiple ile düzenlenir; update sırasında
    /// <c>roleIds = roles.Select(r => r.id)</c> şeklinde unwrap edilip
    /// <c>UpdateAppUserRoles</c> endpoint'ine gönderilir.
    /// </summary>
    public List<EntityReference> Roles { get; set; } = new();

    public bool IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
