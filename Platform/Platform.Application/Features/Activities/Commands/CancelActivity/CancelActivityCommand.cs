using Platform.Application.CommandHandler;
using Platform.Application.Common.Results;
using Platform.Application.Modals.ActivityModal;
using MediatR;

namespace Platform.Application.Features.Activities.Commands.CancelActivity;

public sealed record CancelActivityCommand(Guid Id) : IRequest<Result<ActivityBaseModal>>;

public sealed class CancelActivityHandler : IRequestHandler<CancelActivityCommand, Result<ActivityBaseModal>>
{
    private readonly ActivityCommandHandler _inner;

    public CancelActivityHandler(ActivityCommandHandler inner) => _inner = inner;

    public async Task<Result<ActivityBaseModal>> Handle(CancelActivityCommand request, CancellationToken cancellationToken)
    {
        var result = await _inner.Cancel(request.Id, cancellationToken);
        return result;
    }
}
