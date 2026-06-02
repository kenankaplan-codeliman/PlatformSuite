using FluentValidation;

namespace Crm.Application.Features.Products.Commands.CreateProduct;

public sealed class CreateProductValidator : AbstractValidator<CreateProductCommand>
{
    public CreateProductValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(250);
        RuleFor(x => x.ProductCode).NotEmpty().MaximumLength(50);
        // Category / UnitOfMeasure / UnitPriceCurrency GeneralParameter code'u — geçerli kod kontrolü handler'da.
        RuleFor(x => x.Category).MaximumLength(50);
        RuleFor(x => x.UnitOfMeasure).MaximumLength(50);
        RuleFor(x => x.UnitPriceCurrency).MaximumLength(10);
        RuleFor(x => x.UnitPrice).GreaterThanOrEqualTo(0).When(x => x.UnitPrice.HasValue);
    }
}
