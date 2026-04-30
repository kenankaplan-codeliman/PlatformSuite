using Platform.Domain.Entities.Common;
using Platform.Domain.Entities.Identities;
using CodePro.Domain.Enums;
using Platform.Domain.Enums;

namespace CodePro.Domain.Entities.Budgets
{
    public class Budget : IBaseEntity, ISoftDeleteEntity, IAuditableEntity, IOwnedEntity
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        public Guid? ScopeOrganizationId { get; set; }
        public AppOrganization? ScopeOrganization { get; set; }

        public Guid? BudgetCategoryId { get; set; }
        public BudgetCategory? BudgetCategory { get; set; }

        public BudgetPeriodType PeriodType { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }

        public decimal TotalAmount { get; set; }
        public string Currency { get; set; } = "TRY";

        public BudgetOverflowBehavior OverflowBehavior { get; set; } = BudgetOverflowBehavior.Block;
        public BudgetReleasePoint ReservationReleasePoint { get; set; } = BudgetReleasePoint.PurchaseOrder;

        public int AlertThresholdPercentage { get; set; } = 80;
        public bool CarryOverEnabled { get; set; }

        public Guid ResponsibleUserId { get; set; }

        public BudgetStatus Status { get; set; } = BudgetStatus.Active;

        public ICollection<BudgetTransaction> Transactions { get; set; } = new List<BudgetTransaction>();
        public ICollection<BudgetAllocation> Allocations { get; set; } = new List<BudgetAllocation>();
        public ICollection<BudgetApprovalStep> ApprovalSteps { get; set; } = new List<BudgetApprovalStep>();

        public bool IsActive { get; private set; } = true;

        public Guid CreatedBy { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public Guid? UpdatedBy { get; private set; }
        public DateTime? UpdatedAt { get; private set; }

        public bool IsDeleted { get; private set; }
        public Guid? DeletedBy { get; private set; }
        public DateTime? DeletedAt { get; private set; }

        public Guid OwnerId { get; set; }
        public Guid OrganizationId { get; private set; }
    }
}
