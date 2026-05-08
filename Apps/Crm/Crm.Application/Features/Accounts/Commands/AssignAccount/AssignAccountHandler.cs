using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Crm.Application.Interfaces;
using MediatR;

namespace Crm.Application.Features.Accounts.Commands.AssignAccount;

public sealed class AssignAccountHandler : IRequestHandler<AssignAccountCommand, Result>
{
    private readonly IAccountRepository _repository;

    public AssignAccountHandler(IAccountRepository repository) => _repository = repository;

    public async Task<Result> Handle(AssignAccountCommand request, CancellationToken cancellationToken)
    {
        await _repository.AssignAsync(request.Ids, request.OwnerId, cancellationToken);
        return Result.Success();
    }
}
