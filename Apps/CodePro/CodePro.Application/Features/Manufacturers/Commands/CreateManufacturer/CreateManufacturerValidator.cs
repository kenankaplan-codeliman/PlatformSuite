using FluentValidation;

namespace CodePro.Application.Features.Manufacturers.Commands.CreateManufacturer;

public sealed class CreateManufacturerValidator : AbstractValidator<CreateManufacturerCommand>
{
    public CreateManufacturerValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
    }
}
