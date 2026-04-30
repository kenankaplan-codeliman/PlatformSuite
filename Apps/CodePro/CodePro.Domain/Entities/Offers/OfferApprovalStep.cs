using CodePro.Domain.Enums;
using Platform.Domain.Enums;

namespace CodePro.Domain.Entities.Offers
{
    public class OfferApprovalStep
    {
        public Guid Id { get; set; }
        public Guid OfferId { get; set; }
        public int OrderIndex { get; set; }
        public Guid ApproverUserId { get; set; }
        public string RoleLabel { get; set; } = string.Empty;
        public OfferApprovalStepStatus Status { get; set; } = OfferApprovalStepStatus.NotYet;
        public DateTime? ActionedAt { get; set; }
        public string? RejectionReason { get; set; }
    }
}
