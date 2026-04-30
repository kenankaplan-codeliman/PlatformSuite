namespace Platform.Application.Features.AppRoles.Dtos;

public class AppRoleListItem
{
    public Guid Id { get; set; }
    public string RoleName { get; set; } = default!;
    public string? Description { get; set; }
    public bool IsDefault { get; set; }
    public bool IsActive { get; set; }
}
