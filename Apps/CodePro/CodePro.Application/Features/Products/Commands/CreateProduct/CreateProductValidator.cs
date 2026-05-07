using FluentValidation;

namespace CodePro.Application.Features.Products.Commands.CreateProduct;

public sealed class CreateProductValidator : AbstractValidator<CreateProductCommand>
{
    public CreateProductValidator()
    {
        RuleFor(x => x.Code).NotEmpty().MaximumLength(25);
        RuleFor(x => x.Name).NotEmpty().MaximumLength(50);
        RuleFor(x => x.ShortDescription).NotEmpty().MaximumLength(50);
        RuleFor(x => x.UnitOfMeasure).MaximumLength(50);
        RuleFor(x => x.ManufacturerPartNumber).MaximumLength(25);
        RuleFor(x => x.Model).MaximumLength(25);
        RuleFor(x => x.Color).MaximumLength(25);
        RuleFor(x => x.DeliveryDays).GreaterThanOrEqualTo(0);
        RuleFor(x => x.ProductCategory).NotNull();
        RuleFor(x => x.ProductCategory!.Id).NotEmpty().When(x => x.ProductCategory != null);
    }
}
