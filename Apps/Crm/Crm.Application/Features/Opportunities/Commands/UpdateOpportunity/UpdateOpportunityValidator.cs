using FluentValidation;

namespace Crm.Application.Features.Opportunities.Commands.UpdateOpportunity;

public sealed class UpdateOpportunityValidator : AbstractValidator<UpdateOpportunityCommand>
{
    public UpdateOpportunityValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(250);
        RuleFor(x => x.Account).NotNull();
        RuleFor(x => x.Account!.Id).NotEmpty().When(x => x.Account != null);
        RuleFor(x => x.Stage).IsInEnum();
        RuleFor(x => x.Amount).GreaterThanOrEqualTo(0).When(x => x.Amount.HasValue);
        RuleFor(x => x.Probability).InclusiveBetween(0, 100);
        RuleFor(x => x.LossReason).MaximumLength(500);
    }
}
