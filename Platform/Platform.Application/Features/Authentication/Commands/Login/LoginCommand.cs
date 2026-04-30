using Platform.Application.CommandHandler;
using Platform.Application.Common.Results;
using Platform.Application.Modals;
using Platform.Application.Modals.Authentication;
using MediatR;

namespace Platform.Application.Features.Authentication.Commands.Login;

public sealed record LoginCommand(string Email, string Password, ClientInfo? Client) : IRequest<Result<AuthenticationToken>>;

public sealed class LoginHandler : IRequestHandler<LoginCommand, Result<AuthenticationToken>>
{
    private readonly AuthenticationCommandHandler _inner;

    public LoginHandler(AuthenticationCommandHandler inner) => _inner = inner;

    public async Task<Result<AuthenticationToken>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var token = await _inner.LoginAsync(request.Email, request.Password, request.Client);
        return token;
    }
}
