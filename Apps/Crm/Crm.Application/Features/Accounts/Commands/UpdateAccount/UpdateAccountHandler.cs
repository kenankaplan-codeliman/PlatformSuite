using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Crm.Application.Interfaces;
using Crm.Application.Features.Accounts.Dtos;
using Crm.Domain.Entities.Accounts;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Accounts.Commands.UpdateAccount;

public sealed class UpdateAccountHandler : IRequestHandler<UpdateAccountCommand, Result<AccountDetailItem>>
{
    private readonly IAccountRepository _repository;
    private readonly IAttachmentRepository _attachmentRepository;
    private readonly ICrmDbContext _db;

    public UpdateAccountHandler(
        IAccountRepository repository,
        IAttachmentRepository attachmentRepository,
        ICrmDbContext db)
    {
        _repository = repository;
        _attachmentRepository = attachmentRepository;
        _db = db;
    }

    public async Task<Result<AccountDetailItem>> Handle(UpdateAccountCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return AccountErrors.NotFound;

        request.Adapt(entity);
        await _repository.UpdateAsync(entity, cancellationToken);

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
        return saved.Adapt<AccountDetailItem>();
    }
}
