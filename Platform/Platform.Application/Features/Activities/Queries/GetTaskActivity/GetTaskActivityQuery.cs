using Platform.Application.CommandHandler;
using Platform.Application.Common.Results;
using Platform.Application.Modals.ActivityModal;
using MediatR;

namespace Platform.Application.Features.Activities.Queries.GetTaskActivity;

public sealed record GetTaskActivityQuery(Guid Id) : IRequest<Result<TaskModal>>;

public sealed class GetTaskActivityHandler : IRequestHandler<GetTaskActivityQuery, Result<TaskModal>>
{
    private readonly ActivityCommandHandler _inner;

    public GetTaskActivityHandler(ActivityCommandHandler inner) => _inner = inner;

    public async Task<Result<TaskModal>> Handle(GetTaskActivityQuery request, CancellationToken cancellationToken)
    {
        var result = await _inner.TaskRead(request.Id, cancellationToken);
        return result;
    }
}
