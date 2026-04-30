using Platform.Application.CommandHandler;
using Platform.Application.Common.Results;
using Platform.Application.Modals.ActivityModal;
using MediatR;

namespace Platform.Application.Features.Activities.Commands.UpdateAppointmentActivity;

public sealed class UpdateAppointmentActivityCommand : AppointmentModal, IRequest<Result<AppointmentModal>> { }

public sealed class UpdateAppointmentActivityHandler : IRequestHandler<UpdateAppointmentActivityCommand, Result<AppointmentModal>>
{
    private readonly ActivityCommandHandler _inner;

    public UpdateAppointmentActivityHandler(ActivityCommandHandler inner) => _inner = inner;

    public async Task<Result<AppointmentModal>> Handle(UpdateAppointmentActivityCommand request, CancellationToken cancellationToken)
    {
        var result = await _inner.AppointmentUpdate(request, cancellationToken);
        return result;
    }
}
