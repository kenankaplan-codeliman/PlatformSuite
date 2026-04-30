using Platform.Application.CommandHandler;
using Platform.Application.Common.Results;
using Platform.Application.Modals.ActivityModal;
using MediatR;

namespace Platform.Application.Features.Activities.Commands.UpdatePhoneCallActivity;

public sealed class UpdatePhoneCallActivityCommand : PhoneCallModal, IRequest<Result<PhoneCallModal>> { }

public sealed class UpdatePhoneCallActivityHandler : IRequestHandler<UpdatePhoneCallActivityCommand, Result<PhoneCallModal>>
{
    private readonly ActivityCommandHandler _inner;

    public UpdatePhoneCallActivityHandler(ActivityCommandHandler inner) => _inner = inner;

    public async Task<Result<PhoneCallModal>> Handle(UpdatePhoneCallActivityCommand request, CancellationToken cancellationToken)
    {
        var result = await _inner.PhoneCallUpdate(request, cancellationToken);
        return result;
    }
}
