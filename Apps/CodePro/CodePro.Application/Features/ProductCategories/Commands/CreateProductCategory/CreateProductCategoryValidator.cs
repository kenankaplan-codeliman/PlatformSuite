using FluentValidation;

namespace CodePro.Application.Features.ProductCategories.Commands.CreateProductCategory;

public sealed class CreateProductCategoryValidator : AbstractValidator<CreateProductCategoryCommand>
{
    public CreateProductCategoryValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Code).MaximumLength(20);
    }
}
