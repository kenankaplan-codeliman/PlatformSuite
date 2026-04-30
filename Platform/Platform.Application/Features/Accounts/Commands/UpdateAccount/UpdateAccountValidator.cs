using FluentValidation;

namespace Platform.Application.Features.Accounts.Commands.UpdateAccount;

public sealed class UpdateAccountValidator : AbstractValidator<UpdateAccountCommand>
{
    public UpdateAccountValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.AccountName).NotEmpty().MaximumLength(200);
        RuleFor(x => x.AccountType).IsInEnum();
        RuleFor(x => x.AccountStatus).IsInEnum();
        RuleFor(x => x.Industry).MaximumLength(200);
        RuleFor(x => x.Website).MaximumLength(500);
        RuleFor(x => x.AnnualRevenue).GreaterThanOrEqualTo(0).When(x => x.AnnualRevenue.HasValue);
        RuleFor(x => x.NumberOfEmployees).GreaterThanOrEqualTo(0).When(x => x.NumberOfEmployees.HasValue);
    }
}
