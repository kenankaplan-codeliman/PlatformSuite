using CodePro.Application.Features.Budgets.Dtos;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.Budgets.Queries.GetBudget;

public sealed record GetBudgetQuery(Guid Id) : IQuery<BudgetDetailItem>;
