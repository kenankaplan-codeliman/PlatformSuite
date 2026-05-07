using FluentValidation;

namespace CodePro.Application.Features.PriceLists.Commands.CreatePriceList;

public sealed class CreatePriceListValidator : AbstractValidator<CreatePriceListCommand>
{
    public CreatePriceListValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Code).MaximumLength(50);
        RuleFor(x => x.Description).MaximumLength(1000);
        RuleFor(x => x.SupplierAccount).NotNull();
        RuleFor(x => x.SupplierAccount!.Id).NotEmpty().When(x => x.SupplierAccount != null);
    }
}
