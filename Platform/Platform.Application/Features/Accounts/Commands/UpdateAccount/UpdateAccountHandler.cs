using Platform.Application.Common.Results;
using Platform.Application.Features.Accounts.Dtos;
using Platform.Application.Interfaces;
using Mapster;
using MediatR;

namespace Platform.Application.Features.Accounts.Commands.UpdateAccount;

public sealed class UpdateAccountHandler : IRequestHandler<UpdateAccountCommand, Result<AccountDetailItem>>
{
    private readonly IAccountRepository _repository;

    public UpdateAccountHandler(IAccountRepository repository) => _repository = repository;

    public async Task<Result<AccountDetailItem>> Handle(UpdateAccountCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return AccountErrors.NotFound;

        request.Adapt(entity);
        await _repository.UpdateAsync(entity, cancellationToken);

        return entity.Adapt<AccountDetailItem>();
    }
}
