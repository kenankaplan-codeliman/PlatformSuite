using CodePro.Domain.Enums;

namespace CodePro.Application.Features.Budgets.Dtos;

public class BudgetListFilter
{
    public string? Search { get; set; }
    public BudgetStatus? Status { get; set; }
    public BudgetPeriodType? PeriodType { get; set; }
    public Guid? BudgetCategoryId { get; set; }
    public bool? IsActive { get; set; }
}
