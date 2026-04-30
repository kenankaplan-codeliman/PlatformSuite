using Platform.Application.Common.Abstractions;
using Platform.Application.Features.Attachments.Dtos;
using Platform.Domain.Enums;

namespace Platform.Application.Features.Attachments.Commands.UploadAttachment;

/// <summary>
/// Dosya yükleme komutu. Controller IFormFile'ı parse edip Command'a byte[] olarak iletir.
/// </summary>
public sealed class UploadAttachmentCommand : ICommand<AttachmentMetadataItem>
{
    public Guid EntityId { get; init; }
    public string EntityType { get; init; } = string.Empty;
    public string FileName { get; init; } = string.Empty;
    public string ContentType { get; init; } = string.Empty;
    public long FileSize { get; init; }
    public byte[] DataBytes { get; init; } = Array.Empty<byte>();
    public DocumentType DocumentType { get; init; } = DocumentType.Other;
    public string? Subject { get; init; }
    public string? Description { get; init; }
}
