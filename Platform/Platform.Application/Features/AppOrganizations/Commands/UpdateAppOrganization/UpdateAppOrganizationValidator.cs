using FluentValidation;

namespace Platform.Application.Features.AppOrganizations.Commands.UpdateAppOrganization;

public sealed class UpdateAppOrganizationValidator : AbstractValidator<UpdateAppOrganizationCommand>
{
    public UpdateAppOrganizationValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.OrganizationCode).NotEmpty().MaximumLength(50);
        RuleFor(x => x.OrganizationName).NotEmpty().MaximumLength(150);
        RuleFor(x => x.Description).MaximumLength(1000);
        RuleFor(x => x.Type).IsInEnum();
        RuleFor(x => x.CostCenter).MaximumLength(100);
    }
}
