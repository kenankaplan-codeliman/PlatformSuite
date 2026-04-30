using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using MediatR;

namespace Platform.Application.Features.Accounts.Commands.DeleteAccount;

public sealed class DeleteAccountHandler : IRequestHandler<DeleteAccountCommand, Result>
{
    private readonly IAccountRepository _repository;

    public DeleteAccountHandler(IAccountRepository repository) => _repository = repository;

    public async Task<Result> Handle(DeleteAccountCommand request, CancellationToken cancellationToken)
    {
        foreach (var id in request.Ids)
        {
            var entity = await _repository.GetAsync(id, cancellationToken);
            if (entity is null) return AccountErrors.NotFound;
            await _repository.DeleteAsync(entity, cancellationToken);
        }

        return Result.Success();
    }
}
