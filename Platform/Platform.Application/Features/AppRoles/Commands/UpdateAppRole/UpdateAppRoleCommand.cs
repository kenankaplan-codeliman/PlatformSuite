using Platform.Application.Common.Abstractions;
using Platform.Application.Features.AppRoles.Dtos;

namespace Platform.Application.Features.AppRoles.Commands.UpdateAppRole;

public sealed class UpdateAppRoleCommand : ICommand<AppRoleDetailItem>
{
    public Guid Id { get; init; }
    public string RoleName { get; init; } = string.Empty;
    public string? Description { get; init; }
    public bool IsDefault { get; init; }
    public List<AppRolePrivilegeItem>? Privileges { get; init; }
}
