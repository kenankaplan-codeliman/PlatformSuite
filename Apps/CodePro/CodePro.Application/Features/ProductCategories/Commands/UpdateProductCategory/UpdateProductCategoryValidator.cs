using FluentValidation;

namespace CodePro.Application.Features.ProductCategories.Commands.UpdateProductCategory;

public sealed class UpdateProductCategoryValidator : AbstractValidator<UpdateProductCategoryCommand>
{
    public UpdateProductCategoryValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Code).MaximumLength(20);
    }
}
