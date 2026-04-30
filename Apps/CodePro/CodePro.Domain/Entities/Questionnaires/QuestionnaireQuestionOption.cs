namespace CodePro.Domain.Entities.Questionnaires
{
    public class QuestionnaireQuestionOption
    {
        public Guid Id { get; set; }
        public Guid QuestionnaireQuestionId { get; set; }

        public string OptionText { get; set; } = string.Empty;
        public int OrderIndex { get; set; }
    }
}
