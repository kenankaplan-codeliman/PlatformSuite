using CodePro.Application.Features.BudgetCategories.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Pagination;

namespace CodePro.Application.Features.BudgetCategories.Queries.ListBudgetCategories;

public sealed class ListBudgetCategoriesQuery : IQuery<PagedResult<BudgetCategoryListItem>>
{
    public PaginationRequest Pagination { get; init; } = new();
    public BudgetCategoryListFilter Filters { get; init; } = new();
}
