using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using MediatR;

namespace Platform.Application.Features.Contacts.Commands.AssignContact;

public sealed class AssignContactHandler : IRequestHandler<AssignContactCommand, Result>
{
    private readonly IContactRepository _repository;

    public AssignContactHandler(IContactRepository repository) => _repository = repository;

    public async Task<Result> Handle(AssignContactCommand request, CancellationToken cancellationToken)
    {
        await _repository.AssignAsync(request.Ids, request.OwnerId, cancellationToken);
        return Result.Success();
    }
}
