using Platform.Application.Common.Abstractions;
using Platform.Application.Features.AppOrganizations.Dtos;
using Platform.Application.Modals.Common;
using Platform.Domain.Enums;

namespace Platform.Application.Features.AppOrganizations.Commands.CreateAppOrganization;

public sealed class CreateAppOrganizationCommand : ICommand<AppOrganizationDetailItem>
{
    public string OrganizationCode { get; init; } = string.Empty;
    public string OrganizationName { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public OrganizationType Type { get; init; } = OrganizationType.DEPARTMENT;
    public string? CostCenter { get; init; }
    public EntityReference? ParentOrganization { get; init; }
    public EntityReference? ReportsTo { get; init; }
}
