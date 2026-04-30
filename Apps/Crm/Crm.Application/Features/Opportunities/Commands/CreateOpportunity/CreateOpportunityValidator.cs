using FluentValidation;

namespace Crm.Application.Features.Opportunities.Commands.CreateOpportunity;

public sealed class CreateOpportunityValidator : AbstractValidator<CreateOpportunityCommand>
{
    public CreateOpportunityValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(250);
        RuleFor(x => x.AccountId).NotEmpty();
        RuleFor(x => x.Stage).IsInEnum();
        RuleFor(x => x.Amount).GreaterThanOrEqualTo(0).When(x => x.Amount.HasValue);
        RuleFor(x => x.Probability).InclusiveBetween(0, 100);
        RuleFor(x => x.LossReason).MaximumLength(500);
    }
}
