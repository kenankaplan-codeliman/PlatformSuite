using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;

namespace CodePro.Application.Features.BudgetCategories.Commands.DeleteBudgetCategory;

public sealed class DeleteBudgetCategoryHandler : IRequestHandler<DeleteBudgetCategoryCommand, Result>
{
    private readonly IBudgetCategoryRepository _repository;

    public DeleteBudgetCategoryHandler(IBudgetCategoryRepository repository) => _repository = repository;

    public async Task<Result> Handle(DeleteBudgetCategoryCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return BudgetCategoryErrors.NotFound;

        await _repository.DeleteAsync(entity, cancellationToken);
        return Result.Success();
    }
}
