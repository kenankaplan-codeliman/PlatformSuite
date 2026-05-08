using FluentValidation;

namespace CodePro.Application.Features.PriceLists.Commands.CreatePriceList;

public sealed class CreatePriceListValidator : AbstractValidator<CreatePriceListCommand>
{
    public CreatePriceListValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Code).MaximumLength(50);
        RuleFor(x => x.Description).MaximumLength(1000);
        RuleFor(x => x.Supplier).NotNull();
        RuleFor(x => x.Supplier!.Id).NotEmpty().When(x => x.Supplier != null);
    }
}
