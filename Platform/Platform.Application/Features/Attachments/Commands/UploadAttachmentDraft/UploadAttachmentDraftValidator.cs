using FluentValidation;

namespace Platform.Application.Features.Attachments.Commands.UploadAttachmentDraft;

public sealed class UploadAttachmentDraftValidator : AbstractValidator<UploadAttachmentDraftCommand>
{
    public UploadAttachmentDraftValidator()
    {
        RuleFor(x => x.FileName).NotEmpty().MaximumLength(500);
        RuleFor(x => x.ContentType).NotEmpty().MaximumLength(200);
        RuleFor(x => x.FileSize).GreaterThan(0);
        RuleFor(x => x.DataBytes).NotEmpty();
        RuleFor(x => x.DocumentType).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Subject).MaximumLength(500);
    }
}
