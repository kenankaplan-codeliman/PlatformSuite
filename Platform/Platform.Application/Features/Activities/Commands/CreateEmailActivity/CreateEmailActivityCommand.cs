using Platform.Application.CommandHandler;
using Platform.Application.Common.Results;
using Platform.Application.Modals.ActivityModal;
using MediatR;

namespace Platform.Application.Features.Activities.Commands.CreateEmailActivity;

public sealed class CreateEmailActivityCommand : EmailModal, IRequest<Result<EmailModal>> { }

public sealed class CreateEmailActivityHandler : IRequestHandler<CreateEmailActivityCommand, Result<EmailModal>>
{
    private readonly ActivityCommandHandler _inner;

    public CreateEmailActivityHandler(ActivityCommandHandler inner) => _inner = inner;

    public async Task<Result<EmailModal>> Handle(CreateEmailActivityCommand request, CancellationToken cancellationToken)
    {
        var result = await _inner.EmailCreate(request, cancellationToken);
        return result;
    }
}
