using Platform.Application.Common.Abstractions;

namespace Platform.Application.Features.AppRoles.Commands.DeleteAppRole;

public sealed record DeleteAppRoleCommand(Guid Id) : ICommand;
