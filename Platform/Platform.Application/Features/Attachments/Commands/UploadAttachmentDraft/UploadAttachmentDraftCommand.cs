using Platform.Application.Common.Abstractions;
using Platform.Application.Features.Attachments.Dtos;

namespace Platform.Application.Features.Attachments.Commands.UploadAttachmentDraft;

/// <summary>
/// Bir dosyayı draft olarak (henüz herhangi bir entity ile ilişkilendirmeden)
/// yükler. Dönüşte metadataId taşıyan DTO döner; frontend bu metadataId'yi
/// parent CreateXCommand/UpdateXCommand içinde Attachments listesiyle gönderir.
/// </summary>
public sealed class UploadAttachmentDraftCommand : ICommand<AttachmentMetadataItem>
{
    public string FileName { get; init; } = string.Empty;
    public string ContentType { get; init; } = string.Empty;
    public long FileSize { get; init; }
    public byte[] DataBytes { get; init; } = Array.Empty<byte>();
    public string DocumentType { get; init; } = "Other";
    public string? Subject { get; init; }
    public string? Description { get; init; }
}
