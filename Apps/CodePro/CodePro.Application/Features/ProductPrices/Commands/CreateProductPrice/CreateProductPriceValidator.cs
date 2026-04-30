using FluentValidation;

namespace CodePro.Application.Features.ProductPrices.Commands.CreateProductPrice;

public sealed class CreateProductPriceValidator : AbstractValidator<CreateProductPriceCommand>
{
    public CreateProductPriceValidator()
    {
        RuleFor(x => x.ProductId).NotEmpty();
        RuleFor(x => x.SupplierAccountId).NotEmpty();
        RuleFor(x => x.MinimumQuantity).GreaterThanOrEqualTo(0);
        RuleFor(x => x.UnitPrice).GreaterThan(0);
        RuleFor(x => x.Currency).NotEmpty().MaximumLength(10);
    }
}
