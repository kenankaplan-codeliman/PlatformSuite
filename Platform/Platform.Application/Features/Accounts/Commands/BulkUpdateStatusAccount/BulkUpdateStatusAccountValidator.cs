using FluentValidation;

namespace Platform.Application.Features.Accounts.Commands.BulkUpdateStatusAccount;

public sealed class BulkUpdateStatusAccountValidator : AbstractValidator<BulkUpdateStatusAccountCommand>
{
    public BulkUpdateStatusAccountValidator()
    {
        RuleFor(x => x.Ids).NotEmpty();
        RuleFor(x => x.Status).IsInEnum();
    }
}
