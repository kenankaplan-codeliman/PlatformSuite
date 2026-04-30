using Platform.Application.CommandHandler;
using Platform.Application.Common.Results;
using Platform.Application.Modals.ActivityModal;
using MediatR;

namespace Platform.Application.Features.Activities.Queries.GetAppointmentActivity;

public sealed record GetAppointmentActivityQuery(Guid Id) : IRequest<Result<AppointmentModal>>;

public sealed class GetAppointmentActivityHandler : IRequestHandler<GetAppointmentActivityQuery, Result<AppointmentModal>>
{
    private readonly ActivityCommandHandler _inner;

    public GetAppointmentActivityHandler(ActivityCommandHandler inner) => _inner = inner;

    public async Task<Result<AppointmentModal>> Handle(GetAppointmentActivityQuery request, CancellationToken cancellationToken)
    {
        var result = await _inner.AppointmentRead(request.Id, cancellationToken);
        return result;
    }
}
