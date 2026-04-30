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
        RuleFor(x => x.Company).MaximumLength(250);
        RuleFor(x => x.Title).MaximumLength(150);
        RuleFor(x => x.Email).MaximumLength(250).EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.Email));
        RuleFor(x => x.Phone).MaximumLength(50);
        RuleFor(x => x.Website).MaximumLength(250);
        RuleFor(x => x.Source).IsInEnum();
        RuleFor(x => x.Status).IsInEnum();
        RuleFor(x => x.EstimatedValue).GreaterThanOrEqualTo(0).When(x => x.EstimatedValue.HasValue);
    }
}
