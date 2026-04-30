using FluentValidation;

namespace CodePro.Application.Features.Questionnaires.Commands.CreateQuestionnaire;

public sealed class CreateQuestionnaireValidator : AbstractValidator<CreateQuestionnaireCommand>
{
    public CreateQuestionnaireValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(300);
        RuleForEach(x => x.Questions).ChildRules(q =>
        {
            q.RuleFor(x => x.QuestionText).NotEmpty().MaximumLength(1000);
        });
    }
}
