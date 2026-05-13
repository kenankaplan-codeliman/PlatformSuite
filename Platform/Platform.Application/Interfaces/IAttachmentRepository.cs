using Platform.Domain.Entities.Attachments;

namespace Platform.Application.Interfaces;

public interface IAttachmentRepository
{
    Task<AttachmentFileMetadata?> GetMetadataAsync(Guid metadataId, CancellationToken cancellationToken = default);
    Task<AttachmentFileData?> GetFileDataAsync(Guid metadataId, CancellationToken cancellationToken = default);
    Task<List<AttachmentFileMetadata>> ListByEntityAsync(Guid entityId, string entityType, CancellationToken cancellationToken = default);

    /// <summary>
    /// Draft attachment'ı kaydeder — file_data + metadata. Relation yok, ExpiresAt set edilir.
    /// SaveChangesAsync çağırmaz; TransactionBehavior commit eder.
    /// </summary>
    Task<AttachmentFileMetadata> CreateDraftAsync(
        byte[] dataBytes,
        string fileName,
        string contentType,
        long fileSize,
        string documentType,
        string? subject,
        string? description,
        DateTime expiresAt,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Bir veya daha fazla draft metadata'yı entity ile ilişkilendirir; her birinin
    /// ExpiresAt değerini NULL'a çeker. SaveChangesAsync çağırmaz; TransactionBehavior
    /// commit eder.
    /// </summary>
    Task AssociateAsync(
        IReadOnlyCollection<Guid> metadataIds,
        Guid entityId,
        string entityType,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Verilen metadataId'ye ait attachment'ı siler (cascade ile file_data + relation
    /// otomatik silinir). SaveChangesAsync çağırmaz; TransactionBehavior commit eder.
    /// </summary>
    Task<bool> DeleteAsync(Guid metadataId, CancellationToken cancellationToken = default);

    /// <summary>
    /// ExpiresAt &lt; threshold koşulunu sağlayan draft'ları temizler. Hosted service
    /// MediatR pipeline'ı dışında çalıştığı için SaveChangesAsync kendi içinde çağrılır.
    /// </summary>
    Task<int> DeleteExpiredDraftsAsync(DateTime threshold, CancellationToken cancellationToken = default);
}
