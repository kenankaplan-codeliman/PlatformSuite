using Platform.Application.CommandHandler;
using Platform.Application.Common.Results;
using Platform.Application.Modals.ActivityModal;
using MediatR;

namespace Platform.Application.Features.Activities.Commands.CreateAppointmentActivity;

public sealed class CreateAppointmentActivityCommand : AppointmentModal, IRequest<Result<AppointmentModal>> { }

public sealed class CreateAppointmentActivityHandler : IRequestHandler<CreateAppointmentActivityCommand, Result<AppointmentModal>>
{
    private readonly ActivityCommandHandler _inner;

    public CreateAppointmentActivityHandler(ActivityCommandHandler inner) => _inner = inner;

    public async Task<Result<AppointmentModal>> Handle(CreateAppointmentActivityCommand request, CancellationToken cancellationToken)
    {
        var result = await _inner.AppointmentCreate(request, cancellationToken);
        return result;
    }
}
