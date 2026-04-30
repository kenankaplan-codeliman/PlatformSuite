using FluentValidation;

namespace CodePro.Application.Features.Manufacturers.Commands.UpdateManufacturer;

public sealed class UpdateManufacturerValidator : AbstractValidator<UpdateManufacturerCommand>
{
    public UpdateManufacturerValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
    }
}
