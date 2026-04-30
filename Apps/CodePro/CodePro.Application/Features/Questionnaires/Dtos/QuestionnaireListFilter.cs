using CodePro.Domain.Enums;

namespace CodePro.Application.Features.Questionnaires.Dtos;

public class QuestionnaireListFilter
{
    public string? Name { get; set; }
    public QuestionnaireRelatedModule? RelatedModule { get; set; }
    public QuestionnaireStatus? Status { get; set; }
    public bool? IsActive { get; set; }
}
