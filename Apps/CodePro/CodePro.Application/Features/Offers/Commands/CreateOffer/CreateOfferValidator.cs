using FluentValidation;

namespace CodePro.Application.Features.Offers.Commands.CreateOffer;

public sealed class CreateOfferValidator : AbstractValidator<CreateOfferCommand>
{
    public CreateOfferValidator()
    {
        RuleFor(x => x.OfferNumber).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Subject).NotEmpty().MaximumLength(500);
        RuleFor(x => x.CounterpartyName).NotEmpty().MaximumLength(300);
        RuleFor(x => x.Currency).NotEmpty().MaximumLength(10);
        RuleFor(x => x.ResponsibleUserId).NotEmpty();
    }
}
