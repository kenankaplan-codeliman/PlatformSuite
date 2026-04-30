using Platform.Domain.Entities.Attachments;

namespace Platform.Application.Interfaces;

public interface IAttachmentRepository
{
    Task<AttachmentFileMetadata?> GetMetadataAsync(Guid metadataId, CancellationToken cancellationToken = default);
    Task<AttachmentFileData?> GetFileDataAsync(Guid metadataId, CancellationToken cancellationToken = default);
    Task<List<AttachmentFileMetadata>> ListByEntityAsync(Guid entityId, string entityType, CancellationToken cancellationToken = default);
    Task<AttachmentFileMetadata> SaveAsync(
        AttachmentFileData fileData,
        AttachmentFileMetadata metadata,
        AttachmentFileRelation relation,
        CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid metadataId, CancellationToken cancellationToken = default);
}
