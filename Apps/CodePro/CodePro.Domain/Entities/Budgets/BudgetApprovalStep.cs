using CodePro.Domain.Enums;
using Platform.Domain.Enums;

namespace CodePro.Domain.Entities.Budgets
{
    public class BudgetApprovalStep
    {
        public Guid Id { get; set; }

        public Guid BudgetId { get; set; }
        public Budget? Budget { get; set; }

        public int OrderIndex { get; set; }
        public Guid ApproverUserId { get; set; }
        public string RoleLabel { get; set; } = string.Empty;
        public BudgetApprovalStepStatus Status { get; set; } = BudgetApprovalStepStatus.NotYet;
        public DateTime? ActionedAt { get; set; }
        public string? RejectionReason { get; set; }
    }
}
