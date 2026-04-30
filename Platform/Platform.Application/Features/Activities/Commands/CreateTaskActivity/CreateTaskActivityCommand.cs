using Platform.Application.CommandHandler;
using Platform.Application.Common.Results;
using Platform.Application.Modals.ActivityModal;
using MediatR;

namespace Platform.Application.Features.Activities.Commands.CreateTaskActivity;

public sealed class CreateTaskActivityCommand : TaskModal, IRequest<Result<TaskModal>> { }

public sealed class CreateTaskActivityHandler : IRequestHandler<CreateTaskActivityCommand, Result<TaskModal>>
{
    private readonly ActivityCommandHandler _inner;

    public CreateTaskActivityHandler(ActivityCommandHandler inner) => _inner = inner;

    public async Task<Result<TaskModal>> Handle(CreateTaskActivityCommand request, CancellationToken cancellationToken)
    {
        var result = await _inner.TaskCreate(request, cancellationToken);
        return result;
    }
}
