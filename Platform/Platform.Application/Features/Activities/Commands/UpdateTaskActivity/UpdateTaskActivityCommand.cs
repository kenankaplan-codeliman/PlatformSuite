using Platform.Application.CommandHandler;
using Platform.Application.Common.Results;
using Platform.Application.Modals.ActivityModal;
using MediatR;

namespace Platform.Application.Features.Activities.Commands.UpdateTaskActivity;

public sealed class UpdateTaskActivityCommand : TaskModal, IRequest<Result<TaskModal>> { }

public sealed class UpdateTaskActivityHandler : IRequestHandler<UpdateTaskActivityCommand, Result<TaskModal>>
{
    private readonly ActivityCommandHandler _inner;

    public UpdateTaskActivityHandler(ActivityCommandHandler inner) => _inner = inner;

    public async Task<Result<TaskModal>> Handle(UpdateTaskActivityCommand request, CancellationToken cancellationToken)
    {
        var result = await _inner.TaskUpdate(request, cancellationToken);
        return result;
    }
}
