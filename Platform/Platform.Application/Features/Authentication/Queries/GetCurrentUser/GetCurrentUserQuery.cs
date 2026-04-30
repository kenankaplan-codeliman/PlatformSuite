using Platform.Application.CommandHandler;
using Platform.Application.Common.Results;
using Platform.Application.Modals.Authentication;
using MediatR;

namespace Platform.Application.Features.Authentication.Queries.GetCurrentUser;

public sealed record GetCurrentUserQuery : IRequest<Result<ClientUserInfo>>;

public sealed class GetCurrentUserHandler : IRequestHandler<GetCurrentUserQuery, Result<ClientUserInfo>>
{
    private readonly AuthenticationCommandHandler _inner;

    public GetCurrentUserHandler(AuthenticationCommandHandler inner) => _inner = inner;

    public async Task<Result<ClientUserInfo>> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        var userInfo = await _inner.CurrentUser();
        return userInfo;
    }
}
