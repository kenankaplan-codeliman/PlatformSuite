using CodePro.Domain.Enums;

namespace CodePro.Application.Features.Questionnaires.Dtos;

public class QuestionnaireListItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public QuestionnaireRelatedModule RelatedModule { get; set; }
    public QuestionnaireStatus Status { get; set; }
    public int QuestionCount { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
