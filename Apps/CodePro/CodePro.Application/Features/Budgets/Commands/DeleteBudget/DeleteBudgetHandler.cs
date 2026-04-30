using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;

namespace CodePro.Application.Features.Budgets.Commands.DeleteBudget;

public sealed class DeleteBudgetHandler : IRequestHandler<DeleteBudgetCommand, Result>
{
    private readonly IBudgetRepository _repository;

    public DeleteBudgetHandler(IBudgetRepository repository) => _repository = repository;

    public async Task<Result> Handle(DeleteBudgetCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return BudgetErrors.NotFound;

        await _repository.DeleteAsync(entity, cancellationToken);
        return Result.Success();
    }
}
