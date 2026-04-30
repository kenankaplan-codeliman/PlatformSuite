namespace Platform.Application.Features.AppUsers.Dtos;

public class AppUserListFilter
{
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public Guid? OrganizationId { get; set; }
    public bool? IsActive { get; set; }
}
