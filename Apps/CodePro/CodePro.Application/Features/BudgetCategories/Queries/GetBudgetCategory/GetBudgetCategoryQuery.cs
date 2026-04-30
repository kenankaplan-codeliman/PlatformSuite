using CodePro.Application.Features.BudgetCategories.Dtos;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.BudgetCategories.Queries.GetBudgetCategory;

public sealed record GetBudgetCategoryQuery(Guid Id) : IQuery<BudgetCategoryDetailItem>;
