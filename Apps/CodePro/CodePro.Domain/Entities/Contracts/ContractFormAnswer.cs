namespace CodePro.Domain.Entities.Contracts
{
    public class ContractFormAnswer
    {
        public Guid Id { get; set; }
        public Guid ContractFormId { get; set; }
        public Guid QuestionnaireQuestionId { get; set; }

        public string? AnswerText { get; set; }
        public decimal? AnswerNumber { get; set; }
        public DateOnly? AnswerDate { get; set; }
        public bool? AnswerBool { get; set; }
        public string? AnswerOptions { get; set; }
    }
}
