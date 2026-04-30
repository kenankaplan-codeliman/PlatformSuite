using Platform.Domain.Enums;

namespace Platform.Application.Features.AppOrganizations.Dtos;

public class AppOrganizationListFilter
{
    public string? OrganizationName { get; set; }
    public string? OrganizationCode { get; set; }
    public OrganizationType? Type { get; set; }
    public Guid? ParentOrganizationId { get; set; }
    public bool? IsActive { get; set; }
}
