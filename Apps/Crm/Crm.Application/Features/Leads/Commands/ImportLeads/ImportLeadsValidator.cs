using FluentValidation;

namespace Crm.Application.Features.Leads.Commands.ImportLeads;

public sealed class ImportLeadsValidator : AbstractValidator<ImportLeadsCommand>
{
    private const int MaxRows = 1000;

    public ImportLeadsValidator()
    {
        RuleFor(x => x.Status).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Rows).NotEmpty().WithMessage("İçe aktarılacak en az bir satır gerekli.");
        RuleFor(x => x.Rows).Must(r => r.Count <= MaxRows)
            .WithMessage($"Tek seferde en fazla {MaxRows} satır içe aktarılabilir.");
    }
}
