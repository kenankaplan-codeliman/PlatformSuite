namespace Platform.Domain.Entities.Attachments;

/// <summary>
/// Binary dosya verisi. Sadece ID ile ayrı çekilir; liste sorgularına dahil edilmez.
/// </summary>
public class AttachmentFileData
{
    public Guid Id { get; set; }
    public byte[] DataBytes { get; set; } = null!;

    // Navigation
    public AttachmentFileMetadata Metadata { get; set; } = null!;
}
