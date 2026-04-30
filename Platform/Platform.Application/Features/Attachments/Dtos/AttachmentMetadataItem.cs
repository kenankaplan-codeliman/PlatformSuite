using Platform.Domain.Enums;

namespace Platform.Application.Features.Attachments.Dtos;

/// <summary>
/// Attachment dosya meta verisi (binary içermez). Liste ve detail response'larında kullanılır.
/// </summary>
public class AttachmentMetadataItem
{
    public Guid Id { get; set; }
    public string FileName { get; set; } = default!;
    public string ContentType { get; set; } = default!;
    public long FileSize { get; set; }
    public DocumentType DocumentType { get; set; }
    public string? Subject { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid CreatedBy { get; set; }
}
