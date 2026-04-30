using Platform.Application.CommandHandler;
using Platform.Application.Common.Results;
using Platform.Domain.Enums;
using MediatR;

namespace Platform.Application.Features.Activities.Commands.BulkUpdateStatusActivity;

public sealed record BulkUpdateStatusActivityCommand(List<Guid> Ids, ActivityStatus Status) : IRequest<Result>;

public sealed class BulkUpdateStatusActivityHandler : IRequestHandler<BulkUpdateStatusActivityCommand, Result>
{
    private readonly ActivityCommandHandler _inner;

    public BulkUpdateStatusActivityHandler(ActivityCommandHandler inner) => _inner = inner;

    public async Task<Result> Handle(BulkUpdateStatusActivityCommand request, CancellationToken cancellationToken)
    {
        await _inner.BulkUpdateStatus(request.Ids, request.Status, cancellationToken);
        return Result.Success();
    }
}
