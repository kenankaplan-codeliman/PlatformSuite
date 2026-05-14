using FluentValidation;

namespace Crm.Application.Features.Accounts.Commands.BulkUpdateStatusAccount;

public sealed class BulkUpdateStatusAccountValidator : AbstractValidator<BulkUpdateStatusAccountCommand>
{
    public BulkUpdateStatusAccountValidator()
    {
        RuleFor(x => x.Ids).NotEmpty();
        RuleFor(x => x.Status).NotEmpty().MaximumLength(50);
    }
}
