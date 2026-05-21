using Platform.Application.Common.Parameters;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Crm.Application.Interfaces;
using Crm.Application.Common.Communications;
using Crm.Application.Features.Accounts.Dtos;
using Crm.Domain.Entities.Accounts;
using Crm.Domain.Parameters;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Accounts.Commands.UpdateAccount;

public sealed class UpdateAccountHandler : IRequestHandler<UpdateAccountCommand, Result<AccountDetailItem>>
{
    private readonly IAccountRepository _repository;
    private readonly IAttachmentRepository _attachmentRepository;
    private readonly ICommunicationRepository _communications;
    private readonly ICrmDbContext _db;
    private readonly IGeneralParameterReader _parameters;

    public UpdateAccountHandler(
        IAccountRepository repository,
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

    public async Task<Result<AccountDetailItem>> Handle(UpdateAccountCommand request, CancellationToken cancellationToken)
    {
        if (!await _parameters.ExistsAsync(AccountParameterCodes.Status, request.AccountStatus, cancellationToken))
            return AccountErrors.InvalidStatus;

        if (!await _parameters.ExistsAsync(AccountParameterCodes.Type, request.AccountType, cancellationToken))
            return AccountErrors.InvalidType;

        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return AccountErrors.NotFound;

        request.Adapt(entity);
        await _repository.UpdateAsync(entity, cancellationToken);

        await _communications.SyncAsync(
            nameof(Account), entity.Id, request.Emails, request.Phones, request.Addresses, cancellationToken);

        if (request.Attachments.Count > 0)
        {
            var metadataIds = request.Attachments.Select(a => a.MetadataId).ToList();
            await _attachmentRepository.AssociateAsync(metadataIds, entity.Id, nameof(Account), cancellationToken);
        }

        return await BuildDetailAsync(entity.Id, cancellationToken);
    }

    private async Task<AccountDetailItem> BuildDetailAsync(Guid id, CancellationToken cancellationToken)
    {
        var saved = await _db.Account
            .AsNoTracking()
            .WithDetailIncludes()
            .FirstAsync(a => a.Id == id, cancellationToken);
        var dto = saved.Adapt<AccountDetailItem>();
        (dto.Emails, dto.Phones, dto.Addresses) =
            await _db.LoadCommunicationsAsync(nameof(Account), id, cancellationToken);
        return dto;
    }
}
