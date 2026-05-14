using FluentValidation;

namespace Crm.Application.Features.Contacts.Commands.BulkUpdateStatusContact;

public sealed class BulkUpdateStatusContactValidator : AbstractValidator<BulkUpdateStatusContactCommand>
{
    public BulkUpdateStatusContactValidator()
    {
        RuleFor(x => x.Ids).NotEmpty();
        RuleFor(x => x.Status).NotEmpty().MaximumLength(50);
    }
}
