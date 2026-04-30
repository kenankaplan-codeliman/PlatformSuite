using Platform.Application.CommandHandler;
using Platform.Application.Common.Results;
using Platform.Application.Modals;
using MediatR;

namespace Platform.Application.Features.Authentication.Commands.Logout;

public sealed record LogoutCommand(string AccessToken, ClientInfo? Client) : IRequest<Result>;

public sealed class LogoutHandler : IRequestHandler<LogoutCommand, Result>
{
    private readonly AuthenticationCommandHandler _inner;

    public LogoutHandler(AuthenticationCommandHandler inner) => _inner = inner;

    public async Task<Result> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        await _inner.Logout(request.AccessToken, request.Client);
        return Result.Success();
    }
}
