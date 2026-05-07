using FluentValidation;

namespace CodePro.Application.Features.ProductImages.Commands.UploadProductImage;

public sealed class UploadProductImageValidator : AbstractValidator<UploadProductImageCommand>
{
    public UploadProductImageValidator()
    {
        RuleFor(x => x.ProductId).NotEmpty();
        RuleFor(x => x.FileName).NotEmpty().MaximumLength(260);
        RuleFor(x => x.ContentType).NotEmpty().MaximumLength(120);
        RuleFor(x => x.FileSize).GreaterThan(0);
        RuleFor(x => x.DataBytes).NotEmpty();
        RuleFor(x => x.SortOrder).GreaterThanOrEqualTo(0);
    }
}
