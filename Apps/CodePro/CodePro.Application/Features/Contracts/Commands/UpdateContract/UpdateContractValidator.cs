using FluentValidation;

namespace CodePro.Application.Features.Contracts.Commands.UpdateContract;

public sealed class UpdateContractValidator : AbstractValidator<UpdateContractCommand>
{
    public UpdateContractValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.ContractNumber).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Subject).NotEmpty().MaximumLength(500);
        RuleFor(x => x.CounterpartyName).NotEmpty().MaximumLength(300);
        RuleFor(x => x.ResponsibleUserId).NotEmpty();
    }
}
