using Platform.Application.CommandHandler;
using Platform.Application.Common.Results;
using Platform.Application.Modals;
using Platform.Application.Modals.Authentication;
using MediatR;

namespace Platform.Application.Features.Authentication.Commands.LoginMicrosoft;

public sealed record LoginMicrosoftCommand(string MsalToken, ClientInfo? Client) : IRequest<Result<AuthenticationToken>>;

public sealed class LoginMicrosoftHandler : IRequestHandler<LoginMicrosoftCommand, Result<AuthenticationToken>>
{
    private readonly AuthenticationCommandHandler _inner;

    public LoginMicrosoftHandler(AuthenticationCommandHandler inner) => _inner = inner;

    public async Task<Result<AuthenticationToken>> Handle(LoginMicrosoftCommand request, CancellationToken cancellationToken)
    {
        var token = await _inner.LoginMicrosoftAsync(request.MsalToken, request.Client);
        return token;
    }
}
