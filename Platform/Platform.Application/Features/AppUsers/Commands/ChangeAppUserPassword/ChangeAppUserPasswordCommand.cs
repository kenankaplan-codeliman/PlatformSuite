using Platform.Application.Common.Abstractions;

namespace Platform.Application.Features.AppUsers.Commands.ChangeAppUserPassword;

public sealed class ChangeAppUserPasswordCommand : ICommand
{
    public Guid UserId { get; init; }
    public string CurrentPassword { get; init; } = string.Empty;
    public string NewPassword { get; init; } = string.Empty;
}
