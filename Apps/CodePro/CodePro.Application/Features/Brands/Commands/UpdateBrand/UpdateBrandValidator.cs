using FluentValidation;

namespace CodePro.Application.Features.Brands.Commands.UpdateBrand;

public sealed class UpdateBrandValidator : AbstractValidator<UpdateBrandCommand>
{
    public UpdateBrandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
    }
}
