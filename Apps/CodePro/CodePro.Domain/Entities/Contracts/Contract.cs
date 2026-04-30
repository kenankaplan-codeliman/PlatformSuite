using Platform.Domain.Entities.Common;
using CodePro.Domain.Enums;
using Platform.Domain.Enums;

namespace CodePro.Domain.Entities.Contracts
{
    public class Contract : IBaseEntity, ISoftDeleteEntity, IAuditableEntity, IOwnedEntity
    {
        public Guid Id { get; set; }

        public string ContractNumber { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public ContractType Type { get; set; }

        public string CounterpartyName { get; set; } = string.Empty;
        public Guid? CounterpartyId { get; set; }
        public Guid? RelatedOfferId { get; set; }

        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }

        public ContractRenewalType RenewalType { get; set; } = ContractRenewalType.None;

        public decimal? Amount { get; set; }
        public ContractCurrency? Currency { get; set; }
        public ContractPaymentType? PaymentType { get; set; }

        public Guid ResponsibleUserId { get; set; }
        /// <summary>Ek sorumlular — JSON array olarak UUID string listesi saklanır.</summary>
        public string? AdditionalResponsibleUserIds { get; set; }
        public int ReminderDaysBefore { get; set; } = 30;

        public string? Notes { get; set; }
        public ContractStatus Status { get; set; } = ContractStatus.Draft;

        public DateTime? SentToCounterpartyAt { get; set; }
        public DateTime? SignedAt { get; set; }
        public DateTime? LastReminderSentAt { get; set; }

        public ICollection<ContractApprovalStep> ApprovalSteps { get; set; } = new List<ContractApprovalStep>();
        public ICollection<ContractForm> Forms { get; set; } = new List<ContractForm>();

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
