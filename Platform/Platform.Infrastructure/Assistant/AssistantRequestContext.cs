using Platform.Application.Common.Assistant;

namespace Platform.Infrastructure.Assistant;

/// <summary>Scoped — istek başına ek bilgisini tutar.</summary>
public sealed class AssistantRequestContext : IAssistantRequestContext
{
    public bool HasAttachment { get; private set; }
    public Guid? AttachmentId { get; private set; }
    public string? ContentType { get; private set; }
    public string? FileName { get; private set; }
    public byte[]? Bytes { get; private set; }

    public bool IsImage =>
        HasAttachment && ContentType is not null &&
        ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase);

    public bool IsCsv =>
        HasAttachment &&
        ((ContentType is not null &&
          (ContentType.Contains("csv", StringComparison.OrdinalIgnoreCase) ||
           ContentType.Equals("text/plain", StringComparison.OrdinalIgnoreCase))) ||
         (FileName is not null && FileName.EndsWith(".csv", StringComparison.OrdinalIgnoreCase)));

    public void SetAttachment(Guid attachmentId, string contentType, string fileName, byte[] bytes)
    {
        AttachmentId = attachmentId;
        ContentType = contentType;
        FileName = fileName;
        Bytes = bytes;
        HasAttachment = bytes is { Length: > 0 };
    }
}
