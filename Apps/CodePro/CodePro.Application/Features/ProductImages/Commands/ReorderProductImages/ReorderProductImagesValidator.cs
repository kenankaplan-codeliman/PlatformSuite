using FluentValidation;

namespace CodePro.Application.Features.ProductImages.Commands.ReorderProductImages;

public sealed class ReorderProductImagesValidator : AbstractValidator<ReorderProductImagesCommand>
{
    public ReorderProductImagesValidator()
    {
        RuleFor(x => x.ProductId).NotEmpty();
        RuleFor(x => x.ImageIds).NotNull();
    }
}
