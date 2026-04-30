using CodePro.Domain.Enums;

namespace CodePro.Application.Features.Questionnaires.Dtos;

public class QuestionnaireDetailItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public QuestionnaireRelatedModule RelatedModule { get; set; }
    public QuestionnaireStatus Status { get; set; } = QuestionnaireStatus.Draft;
    public bool IsActive { get; set; } = true;
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<QuestionnaireQuestionItem> Questions { get; set; } = new();
}

public class QuestionnaireQuestionItem
{
    public Guid Id { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public QuestionType QuestionType { get; set; }
    public bool IsRequired { get; set; }
    public int OrderIndex { get; set; }
    public List<QuestionnaireQuestionOptionItem> Options { get; set; } = new();
}

public class QuestionnaireQuestionOptionItem
{
    public Guid Id { get; set; }
    public string OptionText { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
}
