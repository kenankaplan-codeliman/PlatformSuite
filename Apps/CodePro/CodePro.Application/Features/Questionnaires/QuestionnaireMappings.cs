using CodePro.Application.Features.Questionnaires.Dtos;
using CodePro.Domain.Entities.Questionnaires;
using Mapster;

namespace CodePro.Application.Features.Questionnaires;

public static class QuestionnaireMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<QuestionnaireQuestionOption, QuestionnaireQuestionOptionItem>();

        config.NewConfig<QuestionnaireQuestion, QuestionnaireQuestionItem>()
            .Map(d => d.Options, s => s.Options);

        config.NewConfig<Questionnaire, QuestionnaireDetailItem>()
            .Map(d => d.Questions, s => s.Questions);

        config.NewConfig<Questionnaire, QuestionnaireListItem>()
            .Map(d => d.QuestionCount, s => s.Questions.Count);
    }
}
