using Platform.Application.CommandHandler;
using Platform.Application.Common.Results;
using Platform.Application.Modals.ActivityModal;
using MediatR;

namespace Platform.Application.Features.Activities.Commands.UpdateEmailActivity;

public sealed class UpdateEmailActivityCommand : EmailModal, IRequest<Result<EmailModal>> { }

public sealed class UpdateEmailActivityHandler : IRequestHandler<UpdateEmailActivityCommand, Result<EmailModal>>
{
    private readonly ActivityCommandHandler _inner;

    public UpdateEmailActivityHandler(ActivityCommandHandler inner) => _inner = inner;

    public async Task<Result<EmailModal>> Handle(UpdateEmailActivityCommand request, CancellationToken cancellationToken)
    {
        var result = await _inner.EmailUpdate(request, cancellationToken);
        return result;
    }
}
