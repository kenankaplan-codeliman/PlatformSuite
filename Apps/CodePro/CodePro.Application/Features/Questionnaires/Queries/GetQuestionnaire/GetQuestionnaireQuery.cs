using CodePro.Application.Features.Questionnaires.Dtos;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.Questionnaires.Queries.GetQuestionnaire;

public sealed record GetQuestionnaireQuery(Guid Id) : IQuery<QuestionnaireDetailItem>;
