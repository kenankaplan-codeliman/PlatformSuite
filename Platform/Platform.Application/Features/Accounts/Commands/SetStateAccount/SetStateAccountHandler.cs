using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using MediatR;

namespace Platform.Application.Features.Accounts.Commands.SetStateAccount;

public sealed class SetStateAccountHandler : IRequestHandler<SetStateAccountCommand, Result>
{
    private readonly IAccountRepository _repository;

    public SetStateAccountHandler(IAccountRepository repository) => _repository = repository;

    public async Task<Result> Handle(SetStateAccountCommand request, CancellationToken cancellationToken)
    {
        await _repository.SetStateAsync(request.Ids, request.IsActive, cancellationToken);
        return Result.Success();
    }
}
