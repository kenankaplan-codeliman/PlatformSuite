using FluentValidation;

namespace CodePro.Application.Features.ProductPrices.Commands.CreateProductPrice;

public sealed class CreateProductPriceValidator : AbstractValidator<CreateProductPriceCommand>
{
    public CreateProductPriceValidator()
    {
        RuleFor(x => x.Product).NotNull();
        RuleFor(x => x.Product!.Id).NotEmpty().When(x => x.Product != null);
        RuleFor(x => x.SupplierAccount).NotNull();
        RuleFor(x => x.SupplierAccount!.Id).NotEmpty().When(x => x.SupplierAccount != null);
        RuleFor(x => x.MinimumQuantity).GreaterThanOrEqualTo(0);
        RuleFor(x => x.UnitPrice).GreaterThan(0);
        RuleFor(x => x.Currency).NotEmpty().MaximumLength(10);
    }
}
