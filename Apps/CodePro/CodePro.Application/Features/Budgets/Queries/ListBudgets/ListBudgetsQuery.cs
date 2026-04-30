using CodePro.Application.Features.Budgets.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;

namespace CodePro.Application.Features.Budgets.Queries.ListBudgets;

public sealed class ListBudgetsQuery : IQuery<PagedResult<BudgetListItem>>
{
    public PaginationRequest Pagination { get; init; } = new();
    public BudgetListFilter Filters { get; init; } = new();
}
