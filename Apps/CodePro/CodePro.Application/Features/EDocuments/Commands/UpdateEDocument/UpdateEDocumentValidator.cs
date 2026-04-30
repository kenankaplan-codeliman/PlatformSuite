using FluentValidation;

namespace CodePro.Application.Features.EDocuments.Commands.UpdateEDocument;

public sealed class UpdateEDocumentValidator : AbstractValidator<UpdateEDocumentCommand>
{
    public UpdateEDocumentValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Subject).NotEmpty().MaximumLength(500);
        RuleFor(x => x.EntityType).NotEmpty().MaximumLength(100);
        RuleFor(x => x.EntityId).NotEmpty();
    }
}
