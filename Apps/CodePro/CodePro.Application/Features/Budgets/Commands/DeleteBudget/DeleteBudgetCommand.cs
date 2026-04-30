using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.Budgets.Commands.DeleteBudget;

public sealed record DeleteBudgetCommand(Guid Id) : ICommand;
