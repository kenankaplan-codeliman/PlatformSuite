using FluentValidation;

namespace Platform.Application.Features.AppUsers.Commands.ChangeAppUserPassword;

public sealed class ChangeAppUserPasswordValidator : AbstractValidator<ChangeAppUserPasswordCommand>
{
    public ChangeAppUserPasswordValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.CurrentPassword).NotEmpty();
        RuleFor(x => x.NewPassword).NotEmpty().MinimumLength(8).MaximumLength(100);
    }
}
