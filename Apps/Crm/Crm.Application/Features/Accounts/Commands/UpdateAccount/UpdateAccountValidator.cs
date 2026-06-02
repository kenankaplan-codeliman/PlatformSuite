using FluentValidation;

namespace Crm.Application.Features.Accounts.Commands.UpdateAccount;

public sealed class UpdateAccountValidator : AbstractValidator<UpdateAccountCommand>
{
    public UpdateAccountValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.AccountName).NotEmpty().MaximumLength(200);
        // AccountType / AccountStatus artık GeneralParameter code'u — format kontrolü
        // burada, geçerli kod doğrulaması business-rule olarak handler'da yapılır.
        RuleFor(x => x.AccountType).NotEmpty().MaximumLength(50);
        RuleFor(x => x.AccountStatus).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Industry).MaximumLength(200);
        RuleFor(x => x.Website).MaximumLength(500);
        RuleFor(x => x.AnnualRevenue).GreaterThanOrEqualTo(0).When(x => x.AnnualRevenue.HasValue);
        // AnnualRevenueCurrency GeneralParameter code'u — geçerli kod kontrolü handler'da.
        RuleFor(x => x.AnnualRevenueCurrency).MaximumLength(10);
        RuleFor(x => x.NumberOfEmployees).GreaterThanOrEqualTo(0).When(x => x.NumberOfEmployees.HasValue);
    }
}
