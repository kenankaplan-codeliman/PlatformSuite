using Platform.Application.Common.Abstractions;
using Platform.Application.Features.AppRoles.Dtos;

namespace Platform.Application.Features.AppRoles.Commands.CreateAppRole;

public sealed class CreateAppRoleCommand : ICommand<AppRoleDetailItem>
{
    public string RoleName { get; init; } = string.Empty;
    public string? Description { get; init; }
    public bool IsDefault { get; init; }
    public List<AppRolePrivilegeItem> Privileges { get; init; } = new();
}
