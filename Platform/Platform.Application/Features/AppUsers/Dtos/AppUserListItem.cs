using Platform.Application.Modals.Common;

namespace Platform.Application.Features.AppUsers.Dtos;

public class AppUserListItem
{
    public Guid Id { get; set; }
    public string Email { get; set; } = default!;
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string? PhoneNumber { get; set; }

    public EntityReference? Organization { get; set; }
    public EntityReference? Manager { get; set; }

    public bool IsActive { get; set; }
}
