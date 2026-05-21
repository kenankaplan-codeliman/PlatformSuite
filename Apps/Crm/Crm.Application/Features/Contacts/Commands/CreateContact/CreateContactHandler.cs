using Platform.Application.Common.Parameters;
using Platform.Application.Common.Results;
using Crm.Application.Features.Contacts.Dtos;
using Platform.Application.Interfaces;
using Crm.Application.Interfaces;
using Crm.Application.Common.Communications;
using Crm.Domain.Entities.Contacts;
using Crm.Domain.Parameters;
using Mapster;
using MediatR;

namespace Crm.Application.Features.Contacts.Commands.CreateContact;

public sealed class CreateContactHandler : IRequestHandler<CreateContactCommand, Result<ContactDetailItem>>
{
    private readonly IContactRepository _repository;
    private readonly ICommunicationRepository _communications;
    private readonly ICrmDbContext _db;
    private readonly IGeneralParameterReader _parameters;

    public CreateContactHandler(
        IContactRepository repository,
        ICommunicationRepository communications,
        ICrmDbContext db,
        IGeneralParameterReader parameters)
    {
        _repository = repository;
        _communications = communications;
        _db = db;
        _parameters = parameters;
    }

    public async Task<Result<ContactDetailItem>> Handle(CreateContactCommand request, CancellationToken cancellationToken)
    {
        if (!await _parameters.ExistsAsync(ContactParameterCodes.Status, request.ContactStatus, cancellationToken))
            return ContactErrors.InvalidStatus;

        var entity = request.Adapt<Contact>();
        await _repository.CreateAsync(entity, cancellationToken);

        await _communications.SyncAsync(
            nameof(Contact), entity.Id, request.Emails, request.Phones, request.Addresses, cancellationToken);

        return await BuildDetailAsync(entity.Id, cancellationToken);
    }

    private async Task<ContactDetailItem> BuildDetailAsync(Guid id, CancellationToken cancellationToken)
    {
        var saved = await _repository.GetAsync(id, cancellationToken);
        var dto = saved!.Adapt<ContactDetailItem>();
        (dto.Emails, dto.Phones, dto.Addresses) =
            await _db.LoadCommunicationsAsync(nameof(Contact), id, cancellationToken);
        return dto;
    }
}
