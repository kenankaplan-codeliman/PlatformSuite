using FluentValidation;

namespace Crm.Application.Features.Contacts.Commands.UpdateContact;

public sealed class UpdateContactValidator : AbstractValidator<UpdateContactCommand>
{
    public UpdateContactValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.ContactStatus).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Title).MaximumLength(200);
        RuleFor(x => x.Department).MaximumLength(200);
    }
}
