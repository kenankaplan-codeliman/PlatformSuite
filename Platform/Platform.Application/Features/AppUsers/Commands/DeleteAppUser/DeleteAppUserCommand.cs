using Platform.Application.Common.Abstractions;

namespace Platform.Application.Features.AppUsers.Commands.DeleteAppUser;

public sealed record DeleteAppUserCommand(Guid Id) : ICommand;
