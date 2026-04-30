using FluentValidation;

namespace CodePro.Application.Features.Questionnaires.Commands.UpdateQuestionnaire;

public sealed class UpdateQuestionnaireValidator : AbstractValidator<UpdateQuestionnaireCommand>
{
    public UpdateQuestionnaireValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(300);
        RuleForEach(x => x.Questions).ChildRules(q =>
        {
            q.RuleFor(x => x.QuestionText).NotEmpty().MaximumLength(1000);
        });
    }
}
