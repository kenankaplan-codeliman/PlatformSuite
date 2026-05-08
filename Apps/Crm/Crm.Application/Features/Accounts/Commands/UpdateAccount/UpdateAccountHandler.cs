using Platform.Application.Common.Abstractions;
using Crm.Application.Interfaces;
using Platform.Application.Common.Results;
using Crm.Application.Features.Accounts;
using Crm.Application.Features.Accounts.Dtos;
using Platform.Application.Interfaces;
using Crm.Application.Interfaces;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Accounts.Commands.UpdateAccount;

public sealed class UpdateAccountHandler : IRequestHandler<UpdateAccountCommand, Result<AccountDetailItem>>
{
    private readonly IAccountRepository _repository;
    private readonly ICrmDbContext _db;

    public UpdateAccountHandler(IAccountRepository repository, ICrmDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<AccountDetailItem>> Handle(UpdateAccountCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return AccountErrors.NotFound;

        request.Adapt(entity);
        await _repository.UpdateAsync(entity, cancellationToken);

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
