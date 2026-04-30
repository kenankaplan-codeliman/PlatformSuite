using FluentValidation;

namespace CodePro.Application.Features.PurchaseRequests.Commands.CreatePurchaseRequest;

public sealed class CreatePurchaseRequestValidator : AbstractValidator<CreatePurchaseRequestCommand>
{
    public CreatePurchaseRequestValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(300);
        RuleFor(x => x.RequestNumber).MaximumLength(50);
        RuleFor(x => x.CurrencyCode).MaximumLength(10);
    }
}
