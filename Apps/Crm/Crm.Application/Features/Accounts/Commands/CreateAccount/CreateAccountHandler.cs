using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Crm.Application.Interfaces;
using Crm.Application.Features.Accounts.Dtos;
using Crm.Domain.Entities.Accounts;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Accounts.Commands.CreateAccount;

public sealed class CreateAccountHandler : IRequestHandler<CreateAccountCommand, Result<AccountDetailItem>>
{
    private readonly IAccountRepository _repository;
    private readonly IAttachmentRepository _attachmentRepository;
    private readonly ICrmDbContext _db;

    public CreateAccountHandler(
        IAccountRepository repository,
        IAttachmentRepository attachmentRepository,
        ICrmDbContext db)
    {
        _repository = repository;
        _attachmentRepository = attachmentRepository;
        _db = db;
    }

    public async Task<Result<AccountDetailItem>> Handle(CreateAccountCommand request, CancellationToken cancellationToken)
    {
        var entity = request.Adapt<Account>();
        await _repository.CreateAsync(entity, cancellationToken);

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
