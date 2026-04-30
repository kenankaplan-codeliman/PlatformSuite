using FluentValidation;

namespace Platform.Application.Features.AppRoles.Commands.CreateAppRole;

public sealed class CreateAppRoleValidator : AbstractValidator<CreateAppRoleCommand>
{
    public CreateAppRoleValidator()
    {
        RuleFor(x => x.RoleName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Description).MaximumLength(1000);
    }
}
