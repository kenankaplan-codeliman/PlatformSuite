using Platform.Application.CommandHandler;
using Platform.Application.Common.Results;
using Platform.Application.Modals;
using Platform.Application.Modals.Authentication;
using MediatR;

namespace Platform.Application.Features.Authentication.Commands.RefreshToken;

public sealed record RefreshTokenCommand(string RefreshToken, ClientInfo? Client) : IRequest<Result<AuthenticationToken>>;

public sealed class RefreshTokenHandler : IRequestHandler<RefreshTokenCommand, Result<AuthenticationToken>>
{
    private readonly AuthenticationCommandHandler _inner;

    public RefreshTokenHandler(AuthenticationCommandHandler inner) => _inner = inner;

    public async Task<Result<AuthenticationToken>> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var token = await _inner.RefreshToken(request.RefreshToken, request.Client);
        return token;
    }
}
