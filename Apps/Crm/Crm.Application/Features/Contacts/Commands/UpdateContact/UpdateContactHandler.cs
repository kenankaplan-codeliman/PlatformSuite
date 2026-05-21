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

namespace Crm.Application.Features.Contacts.Commands.UpdateContact;

public sealed class UpdateContactHandler : IRequestHandler<UpdateContactCommand, Result<ContactDetailItem>>
{
    private readonly IContactRepository _repository;
    private readonly IAttachmentRepository _attachmentRepository;
    private readonly ICommunicationRepository _communications;
    private readonly ICrmDbContext _db;
    private readonly IGeneralParameterReader _parameters;

    public UpdateContactHandler(
        IContactRepository repository,
        IAttachmentRepository attachmentRepository,
        ICommunicationRepository communications,
        ICrmDbContext db,
        IGeneralParameterReader parameters)
    {
        _repository = repository;
        _attachmentRepository = attachmentRepository;
        _communications = communications;
        _db = db;
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

        await _communications.SyncAsync(
            nameof(Contact), entity.Id, request.Emails, request.Phones, request.Addresses, cancellationToken);

        if (request.Attachments.Count > 0)
        {
            var metadataIds = request.Attachments.Select(a => a.MetadataId).ToList();
            await _attachmentRepository.AssociateAsync(metadataIds, entity.Id, nameof(Contact), cancellationToken);
        }

        var dto = entity.Adapt<ContactDetailItem>();
        (dto.Emails, dto.Phones, dto.Addresses) =
            await _db.LoadCommunicationsAsync(nameof(Contact), entity.Id, cancellationToken);
        return dto;
    }
}
