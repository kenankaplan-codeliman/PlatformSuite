using FluentValidation;

namespace CodePro.Application.Features.ProductPrices.Commands.UpdateProductPrice;

public sealed class UpdateProductPriceValidator : AbstractValidator<UpdateProductPriceCommand>
{
    public UpdateProductPriceValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Product).NotNull();
        RuleFor(x => x.Product!.Id).NotEmpty().When(x => x.Product != null);
        RuleFor(x => x.Supplier).NotNull();
        RuleFor(x => x.Supplier!.Id).NotEmpty().When(x => x.Supplier != null);
        RuleFor(x => x.MinimumQuantity).GreaterThanOrEqualTo(0);
        RuleFor(x => x.UnitPrice).GreaterThan(0);
        RuleFor(x => x.Currency).NotEmpty().MaximumLength(10);
    }
}
