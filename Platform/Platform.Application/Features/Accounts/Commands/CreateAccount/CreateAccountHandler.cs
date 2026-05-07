using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Results;
using Platform.Application.Features.Accounts;
using Platform.Application.Features.Accounts.Dtos;
using Platform.Application.Interfaces;
using Platform.Domain.Entities.Accounts;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Platform.Application.Features.Accounts.Commands.CreateAccount;

public sealed class CreateAccountHandler : IRequestHandler<CreateAccountCommand, Result<AccountDetailItem>>
{
    private readonly IAccountRepository _repository;
    private readonly IApplicationDbContext _db;

    public CreateAccountHandler(IAccountRepository repository, IApplicationDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<AccountDetailItem>> Handle(CreateAccountCommand request, CancellationToken cancellationToken)
    {
        var entity = request.Adapt<Account>();
        await _repository.CreateAsync(entity, cancellationToken);

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
