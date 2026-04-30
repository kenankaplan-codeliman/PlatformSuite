using CodePro.Domain.Enums;
using Platform.Domain.Enums;

namespace CodePro.Domain.Entities.Contracts
{
    public class ContractForm
    {
        public Guid Id { get; set; }
        public Guid ContractId { get; set; }
        public Guid QuestionnaireId { get; set; }
        public ContractFormStatus Status { get; set; } = ContractFormStatus.Empty;
        public Guid? FilledByUserId { get; set; }
        public DateTime? FilledAt { get; set; }
        public DateTime CreatedAt { get; set; }

        public ICollection<ContractFormAnswer> Answers { get; set; } = new List<ContractFormAnswer>();
    }
}
