using FluentValidation;

namespace CodePro.Application.Features.PurchaseRequests.Commands.UpdatePurchaseRequest;

public sealed class UpdatePurchaseRequestValidator : AbstractValidator<UpdatePurchaseRequestCommand>
{
    public UpdatePurchaseRequestValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.RequestNumber).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Title).NotEmpty().MaximumLength(300);
        RuleFor(x => x.CurrencyCode).MaximumLength(10);
    }
}
