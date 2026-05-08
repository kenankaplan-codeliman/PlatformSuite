using FluentValidation;

namespace CodePro.Application.Features.Suppliers.Commands.CreateSupplier;

public sealed class CreateSupplierValidator : AbstractValidator<CreateSupplierCommand>
{
    public CreateSupplierValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Industry).MaximumLength(120);
        RuleFor(x => x.Website).MaximumLength(255);
        RuleFor(x => x.AnnualRevenue).GreaterThanOrEqualTo(0).When(x => x.AnnualRevenue.HasValue);
        RuleFor(x => x.NumberOfEmployees).GreaterThanOrEqualTo(0).When(x => x.NumberOfEmployees.HasValue);
        RuleFor(x => x.SupplierType).IsInEnum();
        RuleFor(x => x.SupplierStatus).IsInEnum();
        RuleFor(x => x.CompanyType).IsInEnum();
        RuleFor(x => x.TaxOffice).MaximumLength(150);
        RuleFor(x => x.Vkn).MaximumLength(20);
        RuleFor(x => x.MersisNo).MaximumLength(20);
        RuleFor(x => x.ContactPersonName).MaximumLength(150);
        RuleFor(x => x.ContactPersonEmail).MaximumLength(255).EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.ContactPersonEmail));
        RuleFor(x => x.ContactPersonPhone).MaximumLength(50);
        RuleFor(x => x.AddressLine).MaximumLength(500);
        RuleFor(x => x.City).MaximumLength(120);
        RuleFor(x => x.Country).MaximumLength(120);
        RuleFor(x => x.PostalCode).MaximumLength(20);
    }
}
