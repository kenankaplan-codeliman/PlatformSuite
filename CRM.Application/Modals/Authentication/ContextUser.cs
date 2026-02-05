using CRM.Application.Interfaces;
using CRM.Domain.Enums;

namespace CRM.Application.Modals;

public class ContextUser : IContextUser
{
    public required Guid UserId { get; set; }
    public required string Email { get; set; } = default!;
    public required string DisplayName { get; set; } = default!;
    public Guid OrganizationId { get; set; }
    public string OrganizationName { get; set; } = default!;
    public List<Guid> AccessibleOrganizationList { get; set; } = default!;
    public Dictionary<string, AccessLevel> PrivilegesCodes { get; set; } = new Dictionary<String, AccessLevel>();
}
