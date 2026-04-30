using CodePro.Domain.Enums;
using Platform.Domain.Enums;

namespace CodePro.Domain.Entities.Contracts
{
    public class ContractApprovalStep
    {
        public Guid Id { get; set; }
        public Guid ContractId { get; set; }
        public int OrderIndex { get; set; }
        public Guid ApproverUserId { get; set; }
        public string RoleLabel { get; set; } = string.Empty;
        public ContractApprovalStepStatus Status { get; set; } = ContractApprovalStepStatus.NotYet;
        public DateTime? ActionedAt { get; set; }
        public string? RejectionReason { get; set; }
    }
}
