using Platform.Application.CommandHandler;
using Platform.Application.Common.Results;
using MediatR;

namespace Platform.Application.Features.Activities.Commands.AssignActivity;

public sealed record AssignActivityCommand(List<Guid> Ids, Guid OwnerId) : IRequest<Result>;

public sealed class AssignActivityHandler : IRequestHandler<AssignActivityCommand, Result>
{
    private readonly ActivityCommandHandler _inner;

    public AssignActivityHandler(ActivityCommandHandler inner) => _inner = inner;

    public async Task<Result> Handle(AssignActivityCommand request, CancellationToken cancellationToken)
    {
        await _inner.AssignAsync(request.Ids, request.OwnerId);
        return Result.Success();
    }
}
