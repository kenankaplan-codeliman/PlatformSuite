using CodePro.Application.Features.Contracts.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Contracts;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Contracts.Commands.UpdateContract;

public sealed class UpdateContractHandler : IRequestHandler<UpdateContractCommand, Result<ContractDetailItem>>
{
    private readonly IContractRepository _repository;
    private readonly IAttachmentRepository _attachmentRepository;
    private readonly ICodeProDbContext _db;

    public UpdateContractHandler(
        IContractRepository repository,
        IAttachmentRepository attachmentRepository,
        ICodeProDbContext db)
    {
        _repository = repository;
        _attachmentRepository = attachmentRepository;
        _db = db;
    }

    public async Task<Result<ContractDetailItem>> Handle(UpdateContractCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return ContractErrors.NotFound;

        var numberExists = await _db.Contract.AsNoTracking()
            .AnyAsync(c => c.Id != request.Id && c.ContractNumber.ToLower() == request.ContractNumber.ToLower(), cancellationToken);
        if (numberExists) return ContractErrors.DuplicateContractNumber;

        entity.ContractNumber = request.ContractNumber;
        entity.Subject = request.Subject;
        entity.Type = request.Type;
        entity.CounterpartyName = request.CounterpartyName;
        entity.CounterpartyId = request.CounterpartyId;
        entity.RelatedOfferId = request.RelatedOfferId;
        entity.StartDate = request.StartDate;
        entity.EndDate = request.EndDate;
        entity.RenewalType = request.RenewalType;
        entity.Amount = request.Amount;
        entity.Currency = request.Currency;
        entity.PaymentType = request.PaymentType;
        entity.ResponsibleUserId = request.ResponsibleUserId;
        entity.AdditionalResponsibleUserIds = request.AdditionalResponsibleUserIds;
        entity.ReminderDaysBefore = request.ReminderDaysBefore;
        entity.Notes = request.Notes;
        entity.Status = request.Status;

        await _repository.UpdateAsync(entity, cancellationToken);

        if (request.Attachments.Count > 0)
        {
            var metadataIds = request.Attachments.Select(a => a.MetadataId).ToList();
            await _attachmentRepository.AssociateAsync(metadataIds, entity.Id, nameof(Contract), cancellationToken);
        }

        return entity.Adapt<ContractDetailItem>();
    }
}
