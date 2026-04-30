namespace Platform.Application.Features.AppRoles.Dtos;

public class AppRoleDetailItem
{
    public Guid Id { get; set; }
    public string RoleName { get; set; } = default!;
    public string? Description { get; set; }
    public bool IsDefault { get; set; }
    public bool IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<AppRolePrivilegeItem> Privileges { get; set; } = new();
}

public class AppRolePrivilegeItem
{
    public string PrivilegeCode { get; set; } = default!;
    public string AccessLevel { get; set; } = default!;
}
