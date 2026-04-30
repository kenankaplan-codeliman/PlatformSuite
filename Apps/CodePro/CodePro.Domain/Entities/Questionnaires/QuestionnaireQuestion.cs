using CodePro.Domain.Enums;
using Platform.Domain.Enums;

namespace CodePro.Domain.Entities.Questionnaires
{
    public class QuestionnaireQuestion
    {
        public Guid Id { get; set; }
        public Guid QuestionnaireId { get; set; }

        public string QuestionText { get; set; } = string.Empty;
        public QuestionType QuestionType { get; set; }
        public bool IsRequired { get; set; }
        public int OrderIndex { get; set; }

        public ICollection<QuestionnaireQuestionOption> Options { get; set; } = new List<QuestionnaireQuestionOption>();
    }
}
