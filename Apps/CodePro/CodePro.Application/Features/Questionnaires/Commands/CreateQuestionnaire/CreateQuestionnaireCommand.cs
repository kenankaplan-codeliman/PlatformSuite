using CodePro.Application.Features.Questionnaires.Dtos;
using CodePro.Domain.Enums;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Attachments;

namespace CodePro.Application.Features.Questionnaires.Commands.CreateQuestionnaire;

public sealed class CreateQuestionnaireCommand : ICommand<QuestionnaireDetailItem>, IAttachmentCarrier
{
    public string Name { get; init; } = string.Empty;
    public QuestionnaireRelatedModule RelatedModule { get; init; }
    public QuestionnaireStatus Status { get; init; } = QuestionnaireStatus.Draft;
    public List<QuestionnaireQuestionItem> Questions { get; init; } = new();
    public List<AttachmentAssociation> Attachments { get; init; } = new();
}
