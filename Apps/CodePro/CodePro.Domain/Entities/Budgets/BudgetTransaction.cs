using CodePro.Domain.Enums;
using Platform.Domain.Enums;

namespace CodePro.Domain.Entities.Budgets
{
    public class BudgetTransaction
    {
        public Guid Id { get; set; }

        public Guid BudgetId { get; set; }
        public Budget? Budget { get; set; }

        public BudgetTransactionType TransactionType { get; set; }

        public decimal Amount { get; set; }

        public BudgetSourceType? SourceType { get; set; }
        public string? SourceId { get; set; }

        public string? Description { get; set; }

        public Guid PerformedBy { get; set; }
        public DateTime PerformedAt { get; set; }

        public Guid? RelatedTransactionId { get; set; }
    }
}
