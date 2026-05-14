using FluentValidation;

namespace Crm.Application.Features.Accounts.Commands.CreateAccount;

public sealed class CreateAccountValidator : AbstractValidator<CreateAccountCommand>
{
    public CreateAccountValidator()
    {
        RuleFor(x => x.AccountName).NotEmpty().MaximumLength(200);
        // AccountType / AccountStatus artık GeneralParameter code'u — format kontrolü
        // burada, geçerli kod doğrulaması business-rule olarak handler'da yapılır.
        RuleFor(x => x.AccountType).NotEmpty().MaximumLength(50);
        RuleFor(x => x.AccountStatus).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Industry).MaximumLength(200);
        RuleFor(x => x.Website).MaximumLength(500);
        RuleFor(x => x.AnnualRevenue).GreaterThanOrEqualTo(0).When(x => x.AnnualRevenue.HasValue);
        RuleFor(x => x.NumberOfEmployees).GreaterThanOrEqualTo(0).When(x => x.NumberOfEmployees.HasValue);
    }
}
