using Platform.Application.CommandHandler;
using Platform.Application.Common.Results;
using Platform.Application.Modals.ActivityModal;
using MediatR;

namespace Platform.Application.Features.Activities.Commands.CompleteActivity;

public sealed record CompleteActivityCommand(Guid Id) : IRequest<Result<ActivityBaseModal>>;

public sealed class CompleteActivityHandler : IRequestHandler<CompleteActivityCommand, Result<ActivityBaseModal>>
{
    private readonly ActivityCommandHandler _inner;

    public CompleteActivityHandler(ActivityCommandHandler inner) => _inner = inner;

    public async Task<Result<ActivityBaseModal>> Handle(CompleteActivityCommand request, CancellationToken cancellationToken)
    {
        var result = await _inner.Complete(request.Id, cancellationToken);
        return result;
    }
}
