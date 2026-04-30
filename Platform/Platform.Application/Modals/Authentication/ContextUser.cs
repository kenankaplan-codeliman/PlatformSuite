using Platform.Application.Interfaces;
using Platform.Domain.Enums;

namespace Platform.Application.Modals;

public class ContextUser : IContextUser
{
    public Guid UserId { get; set; }
    public string Email { get; set; } = default!;
    public string DisplayName { get; set; } = default!;
    public Guid OrganizationId { get; set; }
    public string OrganizationName { get; set; } = default!;
    public List<Guid> AccessibleOrganizationList { get; set; } = default!;
    public Dictionary<string, AccessLevel> PrivilegesCodes { get; set; } = new();
}
