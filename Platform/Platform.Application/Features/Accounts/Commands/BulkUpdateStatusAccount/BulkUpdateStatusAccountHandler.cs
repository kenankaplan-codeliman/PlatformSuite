using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using MediatR;

namespace Platform.Application.Features.Accounts.Commands.BulkUpdateStatusAccount;

public sealed class BulkUpdateStatusAccountHandler : IRequestHandler<BulkUpdateStatusAccountCommand, Result>
{
    private readonly IAccountRepository _repository;

    public BulkUpdateStatusAccountHandler(IAccountRepository repository) => _repository = repository;

    public async Task<Result> Handle(BulkUpdateStatusAccountCommand request, CancellationToken cancellationToken)
    {
        foreach (var id in request.Ids)
        {
            var entity = await _repository.GetAsync(id, cancellationToken);
            if (entity is null) return AccountErrors.NotFound;
            entity.AccountStatus = request.Status;
            await _repository.UpdateAsync(entity, cancellationToken);
        }
        return Result.Success();
    }
}
