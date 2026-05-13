using CodePro.Application.Features.Budgets.Dtos;
using CodePro.Domain.Enums;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Attachments;

namespace CodePro.Application.Features.Budgets.Commands.UpdateBudget;

public sealed class UpdateBudgetCommand : ICommand<BudgetDetailItem>, IAttachmentCarrier
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public Guid? ScopeOrganizationId { get; init; }
    public Guid? BudgetCategoryId { get; init; }
    public BudgetPeriodType PeriodType { get; init; }
    public DateOnly StartDate { get; init; }
    public DateOnly EndDate { get; init; }
    public decimal TotalAmount { get; init; }
    public string Currency { get; init; } = "TRY";
    public BudgetOverflowBehavior OverflowBehavior { get; init; }
    public BudgetReleasePoint ReservationReleasePoint { get; init; }
    public int AlertThresholdPercentage { get; init; }
    public bool CarryOverEnabled { get; init; }
    public Guid ResponsibleUserId { get; init; }
    public BudgetStatus Status { get; init; }
    public List<AttachmentAssociation> Attachments { get; init; } = new();
}
