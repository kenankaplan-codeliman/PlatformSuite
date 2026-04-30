using FluentValidation;

namespace CodePro.Application.Features.ProductCatalogs.Commands.UpdateProductCatalog;

public sealed class UpdateProductCatalogValidator : AbstractValidator<UpdateProductCatalogCommand>
{
    public UpdateProductCatalogValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Code).NotEmpty().MaximumLength(25);
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Description).MaximumLength(1000);
        RuleFor(x => x.PriceCode).MaximumLength(50);
    }
}
