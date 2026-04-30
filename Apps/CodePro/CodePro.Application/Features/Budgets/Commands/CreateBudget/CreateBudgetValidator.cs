using FluentValidation;

namespace CodePro.Application.Features.Budgets.Commands.CreateBudget;

public sealed class CreateBudgetValidator : AbstractValidator<CreateBudgetCommand>
{
    public CreateBudgetValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(300);
        RuleFor(x => x.Currency).NotEmpty().MaximumLength(10);
        RuleFor(x => x.ResponsibleUserId).NotEmpty();
        RuleFor(x => x.AlertThresholdPercentage).InclusiveBetween(0, 100);
    }
}
