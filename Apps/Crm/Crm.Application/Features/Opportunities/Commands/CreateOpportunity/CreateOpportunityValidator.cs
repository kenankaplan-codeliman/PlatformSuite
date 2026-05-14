using FluentValidation;

namespace Crm.Application.Features.Opportunities.Commands.CreateOpportunity;

public sealed class CreateOpportunityValidator : AbstractValidator<CreateOpportunityCommand>
{
    public CreateOpportunityValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(250);
        RuleFor(x => x.Account).NotNull();
        RuleFor(x => x.Account!.Id).NotEmpty().When(x => x.Account != null);
        RuleFor(x => x.Stage).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Amount).GreaterThanOrEqualTo(0).When(x => x.Amount.HasValue);
        RuleFor(x => x.Probability).InclusiveBetween(0, 100);
        RuleFor(x => x.LossReason).MaximumLength(500);
    }
}
