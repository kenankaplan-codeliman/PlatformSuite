using Platform.Domain.Entities.Common;
using CodePro.Domain.Enums;
using Platform.Domain.Enums;

namespace CodePro.Domain.Entities.Offers
{
    public class Offer : IBaseEntity, ISoftDeleteEntity, IAuditableEntity, IOwnedEntity
    {
        public Guid Id { get; set; }

        public string OfferNumber { get; set; } = string.Empty;
        public OfferType OfferType { get; set; }
        public string Subject { get; set; } = string.Empty;

        public string CounterpartyName { get; set; } = string.Empty;
        public Guid? CounterpartyId { get; set; }

        public Guid ResponsibleUserId { get; set; }
        public DateOnly? ValidFrom { get; set; }
        public DateOnly ValidUntil { get; set; }

        public string Currency { get; set; } = "TRY";
        public decimal DiscountPercentage { get; set; }

        public decimal Subtotal { get; set; }
        public decimal VatTotal { get; set; }
        public decimal GrandTotal { get; set; }

        public string? Notes { get; set; }
        public OfferStatus Status { get; set; } = OfferStatus.Draft;

        public string? ResultReason { get; set; }
        public string? ResultReasonCategory { get; set; }

        public Guid? ConvertedContractId { get; set; }

        public DateTime? SentToCounterpartyAt { get; set; }
        public DateTime? ResultMarkedAt { get; set; }

        public ICollection<OfferItem> Items { get; set; } = new List<OfferItem>();
        public ICollection<OfferApprovalStep> ApprovalSteps { get; set; } = new List<OfferApprovalStep>();
        public ICollection<OfferForm> Forms { get; set; } = new List<OfferForm>();
        public ICollection<OfferInvitee> Invitees { get; set; } = new List<OfferInvitee>();

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
