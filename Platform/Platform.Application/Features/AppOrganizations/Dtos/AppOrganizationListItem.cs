using Platform.Domain.Enums;

namespace Platform.Application.Features.AppOrganizations.Dtos;

public class AppOrganizationListItem
{
    public Guid Id { get; set; }
    public string OrganizationCode { get; set; } = default!;
    public string OrganizationName { get; set; } = default!;
    public string? Title { get; set; }
    public OrganizationType Type { get; set; }
    public string? CostCenter { get; set; }
    public Guid? ParentOrganizationId { get; set; }
    public string? ParentOrganizationName { get; set; }
    public bool IsActive { get; set; }
}
