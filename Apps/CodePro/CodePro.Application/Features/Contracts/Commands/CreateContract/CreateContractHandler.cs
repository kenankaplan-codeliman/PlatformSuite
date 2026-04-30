using CodePro.Application.Features.Contracts.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Contracts;
using CodePro.Domain.Enums;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Contracts.Commands.CreateContract;

public sealed class CreateContractHandler : IRequestHandler<CreateContractCommand, Result<ContractDetailItem>>
{
    private readonly IContractRepository _repository;
    private readonly ICodeProDbContext _db;

    public CreateContractHandler(IContractRepository repository, ICodeProDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<ContractDetailItem>> Handle(CreateContractCommand request, CancellationToken cancellationToken)
    {
        var numberExists = await _db.Contract.AsNoTracking()
            .AnyAsync(c => c.ContractNumber.ToLower() == request.ContractNumber.ToLower(), cancellationToken);
        if (numberExists) return ContractErrors.DuplicateContractNumber;

        var entity = new Contract
        {
            ContractNumber = request.ContractNumber,
            Subject = request.Subject,
            Type = request.Type,
            CounterpartyName = request.CounterpartyName,
            CounterpartyId = request.CounterpartyId,
            RelatedOfferId = request.RelatedOfferId,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            RenewalType = request.RenewalType,
            Amount = request.Amount,
            Currency = request.Currency,
            PaymentType = request.PaymentType,
            ResponsibleUserId = request.ResponsibleUserId,
            AdditionalResponsibleUserIds = request.AdditionalResponsibleUserIds,
            ReminderDaysBefore = request.ReminderDaysBefore,
            Notes = request.Notes,
            Status = ContractStatus.Draft,
        };
        await _repository.CreateAsync(entity, cancellationToken);

        return entity.Adapt<ContractDetailItem>();
    }
}
