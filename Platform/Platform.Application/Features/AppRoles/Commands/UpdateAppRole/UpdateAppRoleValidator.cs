using FluentValidation;

namespace Platform.Application.Features.AppRoles.Commands.UpdateAppRole;

public sealed class UpdateAppRoleValidator : AbstractValidator<UpdateAppRoleCommand>
{
    public UpdateAppRoleValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.RoleName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Description).MaximumLength(1000);
    }
}
