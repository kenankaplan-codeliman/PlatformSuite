using Platform.Application.CommandHandler;
using Platform.Application.Common.Results;
using MediatR;

namespace Platform.Application.Features.Activities.Commands.SetStateActivity;

public sealed record SetStateActivityCommand(List<Guid> Ids, bool IsActive) : IRequest<Result>;

public sealed class SetStateActivityHandler : IRequestHandler<SetStateActivityCommand, Result>
{
    private readonly ActivityCommandHandler _inner;

    public SetStateActivityHandler(ActivityCommandHandler inner) => _inner = inner;

    public async Task<Result> Handle(SetStateActivityCommand request, CancellationToken cancellationToken)
    {
        await _inner.SetStateAsync(request.Ids, request.IsActive);
        return Result.Success();
    }
}
