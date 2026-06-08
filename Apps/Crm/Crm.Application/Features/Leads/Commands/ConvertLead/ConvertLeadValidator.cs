using FluentValidation;

namespace Crm.Application.Features.Leads.Commands.ConvertLead;

public sealed class ConvertLeadValidator : AbstractValidator<ConvertLeadCommand>
{
    public ConvertLeadValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        // "En az bir hedef" / "fırsat firma ister" gibi kombinasyon kuralları
        // state gerektirdiği için handler'da business-rule olarak doğrulanır.
    }
}
