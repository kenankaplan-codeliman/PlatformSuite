using Platform.Domain.Enums;

namespace Platform.Application.Features.AppOrganizations.Dtos;

public class AppOrganizationDetailItem
{
    public Guid Id { get; set; }
    public string OrganizationCode { get; set; } = default!;
    public string OrganizationName { get; set; } = default!;
    public string Description { get; set; } = string.Empty;
    public string? Title { get; set; }
    public OrganizationType Type { get; set; }
    public string? CostCenter { get; set; }
    public Guid? ParentOrganizationId { get; set; }
    public string? ParentOrganizationName { get; set; }
    public Guid? ReportsTo { get; set; }
    public string? ReportsToName { get; set; }
    public bool IsDefault { get; set; }
    public bool IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
