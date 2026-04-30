using Platform.Application.CommandHandler;
using Platform.Application.Common.Results;
using Platform.Application.Modals.ActivityModal;
using MediatR;

namespace Platform.Application.Features.Activities.Queries.GetPhoneCallActivity;

public sealed record GetPhoneCallActivityQuery(Guid Id) : IRequest<Result<PhoneCallModal>>;

public sealed class GetPhoneCallActivityHandler : IRequestHandler<GetPhoneCallActivityQuery, Result<PhoneCallModal>>
{
    private readonly ActivityCommandHandler _inner;

    public GetPhoneCallActivityHandler(ActivityCommandHandler inner) => _inner = inner;

    public async Task<Result<PhoneCallModal>> Handle(GetPhoneCallActivityQuery request, CancellationToken cancellationToken)
    {
        var result = await _inner.PhoneCallRead(request.Id, cancellationToken);
        return result;
    }
}
