using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.BudgetCategories.Commands.DeleteBudgetCategory;

public sealed record DeleteBudgetCategoryCommand(Guid Id) : ICommand;
