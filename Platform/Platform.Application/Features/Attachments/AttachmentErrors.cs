using Platform.Application.Common.Results;

namespace Platform.Application.Features.Attachments;

public static class AttachmentErrors
{
    public static readonly Error NotFound =
        new("Attachment.NotFound", "Ek dosya bulunamadı.", ErrorType.NotFound);

    public static readonly Error EmptyFile =
        new("Attachment.EmptyFile", "Boş dosya yüklenemez.", ErrorType.Validation);
}
