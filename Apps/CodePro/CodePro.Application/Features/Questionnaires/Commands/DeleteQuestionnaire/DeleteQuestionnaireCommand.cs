using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.Questionnaires.Commands.DeleteQuestionnaire;

public sealed record DeleteQuestionnaireCommand(Guid Id) : ICommand;
