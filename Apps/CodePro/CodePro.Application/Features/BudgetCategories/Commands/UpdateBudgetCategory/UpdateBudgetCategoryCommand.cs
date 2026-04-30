using CodePro.Application.Features.BudgetCategories.Dtos;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.BudgetCategories.Commands.UpdateBudgetCategory;

public sealed class UpdateBudgetCategoryCommand : ICommand<BudgetCategoryDetailItem>
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Code { get; init; }
    public string? Description { get; init; }
    public Guid? ParentCategoryId { get; init; }
}
