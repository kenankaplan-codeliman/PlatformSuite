using Platform.Application.Common.Parameters;
using Platform.Application.Common.Results;
using Crm.Application.Features.Contacts.Dtos;
using Platform.Application.Interfaces;
using Crm.Application.Interfaces;
using Crm.Domain.Parameters;
using Mapster;
using MediatR;

namespace Crm.Application.Features.Contacts.Commands.UpdateContact;

public sealed class UpdateContactHandler : IRequestHandler<UpdateContactCommand, Result<ContactDetailItem>>
{
    private readonly IContactRepository _repository;
    private readonly IGeneralParameterReader _parameters;

    public UpdateContactHandler(IContactRepository repository, IGeneralParameterReader parameters)
    {
        _repository = repository;
        _parameters = parameters;
    }

    public async Task<Result<ContactDetailItem>> Handle(UpdateContactCommand request, CancellationToken cancellationToken)
    {
        if (!await _parameters.ExistsAsync(ContactParameterCodes.Status, request.ContactStatus, cancellationToken))
            return ContactErrors.InvalidStatus;

        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return ContactErrors.NotFound;

        request.Adapt(entity);
        await _repository.UpdateAsync(entity, cancellationToken);

        return entity.Adapt<ContactDetailItem>();
    }
}
