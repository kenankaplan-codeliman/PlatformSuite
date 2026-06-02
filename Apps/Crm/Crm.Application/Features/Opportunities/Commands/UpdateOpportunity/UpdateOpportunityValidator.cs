using FluentValidation;
using Crm.Application.Features.Opportunities.Commands.CreateOpportunity;

namespace Crm.Application.Features.Opportunities.Commands.UpdateOpportunity;

public sealed class UpdateOpportunityValidator : AbstractValidator<UpdateOpportunityCommand>
{
    public UpdateOpportunityValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(250);
        RuleFor(x => x.Account).NotNull();
        RuleFor(x => x.Account!.Id).NotEmpty().When(x => x.Account != null);
        RuleFor(x => x.Stage).NotEmpty().MaximumLength(50);
        RuleFor(x => x.EstimatedAmount).GreaterThanOrEqualTo(0).When(x => x.EstimatedAmount.HasValue);
        // Currency: opsiyonel; EstimatedAmount girilmişse veya Products varsa zorunlu.
        // GeneralParameter code geçerliliği handler'da doğrulanır.
        RuleFor(x => x.Currency).MaximumLength(10);
        RuleFor(x => x.Currency)
            .NotEmpty()
            .When(x => x.EstimatedAmount.HasValue || (x.Products != null && x.Products.Count > 0));
        RuleFor(x => x.Probability).InclusiveBetween(0, 100);
        RuleFor(x => x.LossReason).MaximumLength(500);
        RuleForEach(x => x.Products).SetValidator(new OpportunityProductModalValidator());
    }
}
