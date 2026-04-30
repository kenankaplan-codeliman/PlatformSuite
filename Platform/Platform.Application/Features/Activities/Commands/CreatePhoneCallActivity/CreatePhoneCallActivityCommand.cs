using Platform.Application.CommandHandler;
using Platform.Application.Common.Results;
using Platform.Application.Modals.ActivityModal;
using MediatR;

namespace Platform.Application.Features.Activities.Commands.CreatePhoneCallActivity;

public sealed class CreatePhoneCallActivityCommand : PhoneCallModal, IRequest<Result<PhoneCallModal>> { }

public sealed class CreatePhoneCallActivityHandler : IRequestHandler<CreatePhoneCallActivityCommand, Result<PhoneCallModal>>
{
    private readonly ActivityCommandHandler _inner;

    public CreatePhoneCallActivityHandler(ActivityCommandHandler inner) => _inner = inner;

    public async Task<Result<PhoneCallModal>> Handle(CreatePhoneCallActivityCommand request, CancellationToken cancellationToken)
    {
        var result = await _inner.PhoneCallCreate(request, cancellationToken);
        return result;
    }
}
