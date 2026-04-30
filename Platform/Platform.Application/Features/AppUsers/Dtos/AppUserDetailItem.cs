namespace Platform.Application.Features.AppUsers.Dtos;

public class AppUserDetailItem
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
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public List<AppUserRoleItem> Roles { get; set; } = new();
}

public class AppUserRoleItem
{
    public Guid Id { get; set; }
    public string RoleName { get; set; } = default!;
    public string? Description { get; set; }
}
