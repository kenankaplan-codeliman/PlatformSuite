using Platform.Application.Common.Parameters;
using Platform.Application.Common.Results;
using Crm.Application.Features.Contacts.Dtos;
using Platform.Application.Interfaces;
using Crm.Application.Interfaces;
using Crm.Domain.Entities.Contacts;
using Crm.Domain.Parameters;
using Mapster;
using MediatR;

namespace Crm.Application.Features.Contacts.Commands.CreateContact;

public sealed class CreateContactHandler : IRequestHandler<CreateContactCommand, Result<ContactDetailItem>>
{
    private readonly IContactRepository _repository;
    private readonly IGeneralParameterReader _parameters;

    public CreateContactHandler(IContactRepository repository, IGeneralParameterReader parameters)
    {
        _repository = repository;
        _parameters = parameters;
    }

    public async Task<Result<ContactDetailItem>> Handle(CreateContactCommand request, CancellationToken cancellationToken)
    {
        if (!await _parameters.ExistsAsync(ContactParameterCodes.Status, request.ContactStatus, cancellationToken))
            return ContactErrors.InvalidStatus;

        var entity = request.Adapt<Contact>();
        await _repository.CreateAsync(entity, cancellationToken);
        return entity.Adapt<ContactDetailItem>();
    }
}
