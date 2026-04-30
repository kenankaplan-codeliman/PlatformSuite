using FluentValidation;

namespace Platform.Application.Features.Attachments.Commands.UploadAttachment;

public sealed class UploadAttachmentValidator : AbstractValidator<UploadAttachmentCommand>
{
    public UploadAttachmentValidator()
    {
        RuleFor(x => x.EntityId).NotEmpty();
        RuleFor(x => x.EntityType).NotEmpty().MaximumLength(100);
        RuleFor(x => x.FileName).NotEmpty().MaximumLength(500);
        RuleFor(x => x.ContentType).NotEmpty().MaximumLength(200);
        RuleFor(x => x.FileSize).GreaterThan(0);
        RuleFor(x => x.DataBytes).NotEmpty();
        RuleFor(x => x.DocumentType).IsInEnum();
        RuleFor(x => x.Subject).MaximumLength(500);
    }
}
