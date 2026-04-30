using Platform.Application.CommandHandler;
using Platform.Application.Common.Results;
using Platform.Application.Modals.ActivityModal;
using MediatR;

namespace Platform.Application.Features.Activities.Queries.GetEmailActivity;

public sealed record GetEmailActivityQuery(Guid Id) : IRequest<Result<EmailModal>>;

public sealed class GetEmailActivityHandler : IRequestHandler<GetEmailActivityQuery, Result<EmailModal>>
{
    private readonly ActivityCommandHandler _inner;

    public GetEmailActivityHandler(ActivityCommandHandler inner) => _inner = inner;

    public async Task<Result<EmailModal>> Handle(GetEmailActivityQuery request, CancellationToken cancellationToken)
    {
        var result = await _inner.EmailRead(request.Id, cancellationToken);
        return result;
    }
}
