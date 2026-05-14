using Platform.Application.Common.Parameters;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Crm.Application.Interfaces;
using Crm.Domain.Parameters;
using MediatR;

namespace Crm.Application.Features.Accounts.Commands.BulkUpdateStatusAccount;

public sealed class BulkUpdateStatusAccountHandler : IRequestHandler<BulkUpdateStatusAccountCommand, Result>
{
    private readonly IAccountRepository _repository;
    private readonly IGeneralParameterReader _parameters;

    public BulkUpdateStatusAccountHandler(IAccountRepository repository, IGeneralParameterReader parameters)
    {
        _repository = repository;
        _parameters = parameters;
    }

    public async Task<Result> Handle(BulkUpdateStatusAccountCommand request, CancellationToken cancellationToken)
    {
        if (!await _parameters.ExistsAsync(AccountParameterCodes.Status, request.Status, cancellationToken))
            return AccountErrors.InvalidStatus;

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
