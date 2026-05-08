using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Crm.Application.Interfaces;
using MediatR;

namespace Crm.Application.Features.Contacts.Commands.SetStateContact;

public sealed class SetStateContactHandler : IRequestHandler<SetStateContactCommand, Result>
{
    private readonly IContactRepository _repository;

    public SetStateContactHandler(IContactRepository repository) => _repository = repository;

    public async Task<Result> Handle(SetStateContactCommand request, CancellationToken cancellationToken)
    {
        await _repository.SetStateAsync(request.Ids, request.IsActive, cancellationToken);
        return Result.Success();
    }
}
