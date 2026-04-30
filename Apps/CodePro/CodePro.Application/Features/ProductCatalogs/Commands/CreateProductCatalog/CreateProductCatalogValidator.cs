using FluentValidation;

namespace CodePro.Application.Features.ProductCatalogs.Commands.CreateProductCatalog;

public sealed class CreateProductCatalogValidator : AbstractValidator<CreateProductCatalogCommand>
{
    public CreateProductCatalogValidator()
    {
        RuleFor(x => x.Code).NotEmpty().MaximumLength(25);
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Description).MaximumLength(1000);
        RuleFor(x => x.PriceCode).MaximumLength(50);
    }
}
