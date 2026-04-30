using Platform.Application.CommandHandler;
using Platform.Application.Common.Results;
using MediatR;

namespace Platform.Application.Features.Activities.Commands.DeleteActivity;

public sealed record DeleteActivityCommand(List<Guid> Ids) : IRequest<Result>;

public sealed class DeleteActivityHandler : IRequestHandler<DeleteActivityCommand, Result>
{
    private readonly ActivityCommandHandler _inner;

    public DeleteActivityHandler(ActivityCommandHandler inner) => _inner = inner;

    public async Task<Result> Handle(DeleteActivityCommand request, CancellationToken cancellationToken)
    {
        await _inner.Delete(request.Ids, cancellationToken);
        return Result.Success();
    }
}
