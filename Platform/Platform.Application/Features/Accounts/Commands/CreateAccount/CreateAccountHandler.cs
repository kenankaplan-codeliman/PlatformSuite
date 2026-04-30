using Platform.Application.Common.Results;
using Platform.Application.Features.Accounts.Dtos;
using Platform.Application.Interfaces;
using Platform.Domain.Entities.Accounts;
using Mapster;
using MediatR;

namespace Platform.Application.Features.Accounts.Commands.CreateAccount;

public sealed class CreateAccountHandler : IRequestHandler<CreateAccountCommand, Result<AccountDetailItem>>
{
    private readonly IAccountRepository _repository;

    public CreateAccountHandler(IAccountRepository repository) => _repository = repository;

    public async Task<Result<AccountDetailItem>> Handle(CreateAccountCommand request, CancellationToken cancellationToken)
    {
        var entity = request.Adapt<Account>();
        await _repository.CreateAsync(entity, cancellationToken);
        return entity.Adapt<AccountDetailItem>();
    }
}
