using FluentValidation;

namespace CodePro.Application.Features.Contracts.Commands.CreateContract;

public sealed class CreateContractValidator : AbstractValidator<CreateContractCommand>
{
    public CreateContractValidator()
    {
        // ContractNumber opsiyonel — boş bırakılırsa numarator otomatik üretir.
        RuleFor(x => x.ContractNumber).MaximumLength(50);
        RuleFor(x => x.Subject).NotEmpty().MaximumLength(500);
        RuleFor(x => x.CounterpartyName).NotEmpty().MaximumLength(300);
        RuleFor(x => x.ResponsibleUserId).NotEmpty();
        RuleFor(x => x.ReminderDaysBefore).GreaterThanOrEqualTo(0);
    }
}
