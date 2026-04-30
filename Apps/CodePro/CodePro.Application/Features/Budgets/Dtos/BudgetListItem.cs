using CodePro.Domain.Enums;

namespace CodePro.Application.Features.Budgets.Dtos;

public class BudgetListItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public BudgetPeriodType PeriodType { get; set; }
    public BudgetStatus Status { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = default!;
    public string? BudgetCategoryName { get; set; }
    public string? ScopeOrganizationName { get; set; }
    public bool IsActive { get; set; }
}
