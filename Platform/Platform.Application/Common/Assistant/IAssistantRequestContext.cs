namespace Platform.Application.Common.Assistant;

/// <summary>
/// Geçerli asistan isteğinin ekini (kartvizit görseli veya CSV) taşıyan scoped bağlam.
/// Handler eki yükler ve burada set eder; orchestrator görsel→vision bloğu / CSV→önizleme
/// kararını buradan verir; dosyaya ihtiyaç duyan araçlar (CSV import) tam baytları buradan
/// okur — böylece dosya her araç şemasına parametre olarak threadlenmez.
/// </summary>
public interface IAssistantRequestContext
{
    bool HasAttachment { get; }
    Guid? AttachmentId { get; }
    string? ContentType { get; }
    string? FileName { get; }
    byte[]? Bytes { get; }

    bool IsImage { get; }
    bool IsCsv { get; }

    void SetAttachment(Guid attachmentId, string contentType, string fileName, byte[] bytes);
}
