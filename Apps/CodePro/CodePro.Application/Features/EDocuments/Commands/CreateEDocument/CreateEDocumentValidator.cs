using FluentValidation;

namespace CodePro.Application.Features.EDocuments.Commands.CreateEDocument;

public sealed class CreateEDocumentValidator : AbstractValidator<CreateEDocumentCommand>
{
    public CreateEDocumentValidator()
    {
        RuleFor(x => x.Subject).NotEmpty().MaximumLength(500);
        RuleFor(x => x.EntityType).NotEmpty().MaximumLength(100);
        RuleFor(x => x.EntityId).NotEmpty();
    }
}
