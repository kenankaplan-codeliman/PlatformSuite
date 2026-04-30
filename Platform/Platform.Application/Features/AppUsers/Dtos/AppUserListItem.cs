namespace Platform.Application.Features.AppUsers.Dtos;

public class AppUserListItem
{
    public Guid Id { get; set; }
    public string Email { get; set; } = default!;
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string? PhoneNumber { get; set; }
    public Guid OrganizationId { get; set; }
    public string? OrganizationName { get; set; }
    public Guid? ManagerId { get; set; }
    public string? ManagerName { get; set; }
    public bool IsActive { get; set; }
}
