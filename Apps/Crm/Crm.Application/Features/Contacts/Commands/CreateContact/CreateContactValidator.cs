using FluentValidation;

namespace Crm.Application.Features.Contacts.Commands.CreateContact;

public sealed class CreateContactValidator : AbstractValidator<CreateContactCommand>
{
    public CreateContactValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.ContactStatus).IsInEnum();
        RuleFor(x => x.Title).MaximumLength(200);
        RuleFor(x => x.Department).MaximumLength(200);
    }
}
