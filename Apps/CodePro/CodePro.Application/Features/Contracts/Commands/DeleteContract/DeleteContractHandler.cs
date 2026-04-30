using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;

namespace CodePro.Application.Features.Contracts.Commands.DeleteContract;

public sealed class DeleteContractHandler : IRequestHandler<DeleteContractCommand, Result>
{
    private readonly IContractRepository _repository;

    public DeleteContractHandler(IContractRepository repository) => _repository = repository;

    public async Task<Result> Handle(DeleteContractCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return ContractErrors.NotFound;

        await _repository.DeleteAsync(entity, cancellationToken);
        return Result.Success();
    }
}
