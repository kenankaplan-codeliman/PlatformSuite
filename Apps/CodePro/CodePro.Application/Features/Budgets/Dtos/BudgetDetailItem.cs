using CodePro.Domain.Enums;

namespace CodePro.Application.Features.Budgets.Dtos;

public class BudgetDetailItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public Guid? ScopeOrganizationId { get; set; }
    public string? ScopeOrganizationName { get; set; }
    public Guid? BudgetCategoryId { get; set; }
    public string? BudgetCategoryName { get; set; }
    public BudgetPeriodType PeriodType { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = "TRY";
    public BudgetOverflowBehavior OverflowBehavior { get; set; }
    public BudgetReleasePoint ReservationReleasePoint { get; set; }
    public int AlertThresholdPercentage { get; set; }
    public bool CarryOverEnabled { get; set; }
    public Guid ResponsibleUserId { get; set; }
    public BudgetStatus Status { get; set; }
    public bool IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
