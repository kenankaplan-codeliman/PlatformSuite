using FluentValidation;

namespace CodePro.Application.Features.ProductPrices.Commands.UpdateProductPrice;

public sealed class UpdateProductPriceValidator : AbstractValidator<UpdateProductPriceCommand>
{
    public UpdateProductPriceValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.ProductId).NotEmpty();
        RuleFor(x => x.SupplierAccountId).NotEmpty();
        RuleFor(x => x.MinimumQuantity).GreaterThanOrEqualTo(0);
        RuleFor(x => x.UnitPrice).GreaterThan(0);
        RuleFor(x => x.Currency).NotEmpty().MaximumLength(10);
    }
}
