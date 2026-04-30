using FluentValidation;

namespace Platform.Application.Features.AppUsers.Commands.UpdateAppUser;

public sealed class UpdateAppUserValidator : AbstractValidator<UpdateAppUserCommand>
{
    public UpdateAppUserValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(150);
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.PhoneNumber).MaximumLength(50);
        RuleFor(x => x.OrganizationId).NotEmpty();
    }
}
