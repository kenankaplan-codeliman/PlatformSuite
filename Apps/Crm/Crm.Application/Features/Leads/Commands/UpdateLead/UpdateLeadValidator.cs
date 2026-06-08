using FluentValidation;

namespace Crm.Application.Features.Leads.Commands.UpdateLead;

public sealed class UpdateLeadValidator : AbstractValidator<UpdateLeadCommand>
{
    public UpdateLeadValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Subject).NotEmpty().MaximumLength(250);
        RuleFor(x => x.FirstName).MaximumLength(100);
        RuleFor(x => x.LastName).MaximumLength(100);
        RuleFor(x => x.Title).MaximumLength(150);
        RuleFor(x => x.Department).MaximumLength(200);
        RuleFor(x => x.Company).MaximumLength(250);
        RuleFor(x => x.Industry).MaximumLength(150);
        RuleFor(x => x.Website).MaximumLength(250);
        // Source / Status / Rating artık GeneralParameter code'u — format kontrolü burada,
        // geçerli kod doğrulaması business-rule olarak handler'da yapılır.
        RuleFor(x => x.Source).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Status).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Rating).MaximumLength(50);
        RuleFor(x => x.EstimatedValue).GreaterThanOrEqualTo(0).When(x => x.EstimatedValue.HasValue);
        // EstimatedValueCurrency GeneralParameter code'u — geçerli kod kontrolü handler'da.
        RuleFor(x => x.EstimatedValueCurrency).MaximumLength(10);
    }
}
