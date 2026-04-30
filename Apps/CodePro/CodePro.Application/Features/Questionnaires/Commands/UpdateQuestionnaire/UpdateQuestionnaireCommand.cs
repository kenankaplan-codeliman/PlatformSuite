using CodePro.Application.Features.Questionnaires.Dtos;
using CodePro.Domain.Enums;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.Questionnaires.Commands.UpdateQuestionnaire;

public sealed class UpdateQuestionnaireCommand : ICommand<QuestionnaireDetailItem>
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public QuestionnaireRelatedModule RelatedModule { get; init; }
    public QuestionnaireStatus Status { get; init; } = QuestionnaireStatus.Draft;
    public List<QuestionnaireQuestionItem> Questions { get; init; } = new();
}
