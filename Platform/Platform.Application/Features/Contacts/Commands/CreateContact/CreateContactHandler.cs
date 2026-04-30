using Platform.Application.Common.Results;
using Platform.Application.Features.Contacts.Dtos;
using Platform.Application.Interfaces;
using Platform.Domain.Entities.Contacts;
using Mapster;
using MediatR;

namespace Platform.Application.Features.Contacts.Commands.CreateContact;

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
