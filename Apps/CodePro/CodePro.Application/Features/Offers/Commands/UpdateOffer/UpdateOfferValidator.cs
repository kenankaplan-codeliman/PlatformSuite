using FluentValidation;

namespace CodePro.Application.Features.Offers.Commands.UpdateOffer;

public sealed class UpdateOfferValidator : AbstractValidator<UpdateOfferCommand>
{
    public UpdateOfferValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.OfferNumber).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Subject).NotEmpty().MaximumLength(500);
        RuleFor(x => x.CounterpartyName).NotEmpty().MaximumLength(300);
        RuleFor(x => x.Currency).NotEmpty().MaximumLength(10);
    }
}
