using FluentValidation;

namespace CodePro.Application.Features.Brands.Commands.CreateBrand;

public sealed class CreateBrandValidator : AbstractValidator<CreateBrandCommand>
{
    public CreateBrandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
    }
}
