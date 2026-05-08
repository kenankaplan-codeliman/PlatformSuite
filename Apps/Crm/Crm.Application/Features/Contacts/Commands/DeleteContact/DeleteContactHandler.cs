using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Crm.Application.Interfaces;
using MediatR;

namespace Crm.Application.Features.Contacts.Commands.DeleteContact;

public sealed class DeleteContactHandler : IRequestHandler<DeleteContactCommand, Result>
{
    private readonly IContactRepository _repository;

    public DeleteContactHandler(IContactRepository repository) => _repository = repository;

    public async Task<Result> Handle(DeleteContactCommand request, CancellationToken cancellationToken)
    {
        foreach (var id in request.Ids)
        {
            var entity = await _repository.GetAsync(id, cancellationToken);
            if (entity is null) return ContactErrors.NotFound;
            await _repository.DeleteAsync(entity, cancellationToken);
        }
        return Result.Success();
    }
}
