using Platform.Application.Common.Abstractions;

namespace Platform.Application.Features.AppUsers.Commands.UpdateAppUserRoles;

public sealed class UpdateAppUserRolesCommand : ICommand
{
    public Guid UserId { get; init; }
    public List<Guid> RoleIds { get; init; } = new();
}
