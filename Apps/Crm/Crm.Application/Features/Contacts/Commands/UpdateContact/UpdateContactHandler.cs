using Platform.Application.Common.Results;
using Crm.Application.Features.Contacts.Dtos;
using Platform.Application.Interfaces;
using Crm.Application.Interfaces;
using Mapster;
using MediatR;

namespace Crm.Application.Features.Contacts.Commands.UpdateContact;

public sealed class UpdateContactHandler : IRequestHandler<UpdateContactCommand, Result<ContactDetailItem>>
{
    private readonly IContactRepository _repository;

    public UpdateContactHandler(IContactRepository repository) => _repository = repository;

    public async Task<Result<ContactDetailItem>> Handle(UpdateContactCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return ContactErrors.NotFound;

        request.Adapt(entity);
        await _repository.UpdateAsync(entity, cancellationToken);

        return entity.Adapt<ContactDetailItem>();
    }
}
