using FluentValidation;

namespace CodePro.Application.Features.PriceLists.Commands.UpdatePriceList;

public sealed class UpdatePriceListValidator : AbstractValidator<UpdatePriceListCommand>
{
    public UpdatePriceListValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Code).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Description).MaximumLength(1000);
        RuleFor(x => x.SupplierAccountId).NotEmpty();
    }
}
