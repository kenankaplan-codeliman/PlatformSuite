using Platform.Domain.Entities.Common;
using CodePro.Domain.Enums;
using Platform.Domain.Enums;

namespace CodePro.Domain.Entities.Questionnaires
{
    public class Questionnaire : IBaseEntity, ISoftDeleteEntity, IAuditableEntity, IOwnedEntity
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public QuestionnaireRelatedModule RelatedModule { get; set; }
        public QuestionnaireStatus Status { get; set; } = QuestionnaireStatus.Draft;

        public ICollection<QuestionnaireQuestion> Questions { get; set; } = new List<QuestionnaireQuestion>();

        public bool IsActive { get; private set; } = true;

        public Guid CreatedBy { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public Guid? UpdatedBy { get; private set; }
        public DateTime? UpdatedAt { get; private set; }

        public bool IsDeleted { get; private set; }
        public Guid? DeletedBy { get; private set; }
        public DateTime? DeletedAt { get; private set; }

        public Guid OwnerId { get; private set; }
        public Guid OrganizationId { get; private set; }
    }
}
