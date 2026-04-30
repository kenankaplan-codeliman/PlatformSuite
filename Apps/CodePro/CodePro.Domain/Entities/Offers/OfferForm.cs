using CodePro.Domain.Enums;
using Platform.Domain.Enums;

namespace CodePro.Domain.Entities.Offers
{
    public class OfferForm
    {
        public Guid Id { get; set; }
        public Guid OfferId { get; set; }
        public Guid QuestionnaireId { get; set; }
        public OfferFormStatus Status { get; set; } = OfferFormStatus.Empty;
        public Guid? FilledByUserId { get; set; }
        public DateTime? FilledAt { get; set; }
        public DateTime CreatedAt { get; set; }

        public ICollection<OfferFormAnswer> Answers { get; set; } = new List<OfferFormAnswer>();
    }
}
