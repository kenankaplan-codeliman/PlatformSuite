using Platform.Application.Common.Results;
using Crm.Application.Features.Contacts.Dtos;
using Platform.Application.Interfaces;
using Crm.Application.Interfaces;
using Crm.Domain.Entities.Contacts;
using Mapster;
using MediatR;

namespace Crm.Application.Features.Contacts.Commands.CreateContact;

public sealed class CreateContactHandler : IRequestHandler<CreateContactCommand, Result<ContactDetailItem>>
{
    private readonly IContactRepository _repository;

    public CreateContactHandler(IContactRepository repository) => _repository = repository;

    public async Task<Result<ContactDetailItem>> Handle(CreateContactCommand request, CancellationToken cancellationToken)
    {
        var entity = request.Adapt<Contact>();
        await _repository.CreateAsync(entity, cancellationToken);
        return entity.Adapt<ContactDetailItem>();
    }
}
