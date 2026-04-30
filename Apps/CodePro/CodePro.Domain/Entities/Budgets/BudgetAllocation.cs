using CodePro.Domain.Enums;
using Platform.Domain.Enums;

namespace CodePro.Domain.Entities.Budgets
{
    public class BudgetAllocation
    {
        public Guid Id { get; set; }

        public Guid BudgetId { get; set; }
        public Budget? Budget { get; set; }

        public BudgetSourceType SourceType { get; set; }
        public string SourceId { get; set; } = string.Empty;

        public decimal AllocatedAmount { get; set; }

        public BudgetAllocationStatus Status { get; set; } = BudgetAllocationStatus.Reserved;

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
