using Platform.Application.Interfaces;
using Platform.Domain.Entities.Attachments;
using Platform.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Platform.Infrastructure.Repositories;

public class AttachmentRepository : IAttachmentRepository
{
    private readonly PlatformDbContext _db;

    public AttachmentRepository(PlatformDbContext db) => _db = db;

    public async Task<AttachmentFileMetadata?> GetMetadataAsync(Guid metadataId, CancellationToken cancellationToken = default)
    {
        return await _db.AttachmentFileMetadata
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.Id == metadataId, cancellationToken);
    }

    public async Task<AttachmentFileData?> GetFileDataAsync(Guid metadataId, CancellationToken cancellationToken = default)
    {
        var metadata = await _db.AttachmentFileMetadata
            .AsNoTracking()
            .Where(m => m.Id == metadataId)
            .Select(m => new { m.FileDataId })
            .FirstOrDefaultAsync(cancellationToken);

        if (metadata is null) return null;

        return await _db.AttachmentFileData
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.Id == metadata.FileDataId, cancellationToken);
    }

    public async Task<List<AttachmentFileMetadata>> ListByEntityAsync(Guid entityId, string entityType, CancellationToken cancellationToken = default)
    {
        var metadataIds = await _db.AttachmentFileRelation
            .AsNoTracking()
            .Where(r => r.EntityId == entityId && r.EntityType == entityType)
            .Select(r => r.MetadataId)
            .ToListAsync(cancellationToken);

        if (metadataIds.Count == 0) return new List<AttachmentFileMetadata>();

        return await _db.AttachmentFileMetadata
            .AsNoTracking()
            .Where(m => metadataIds.Contains(m.Id))
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<AttachmentFileMetadata> SaveAsync(
        AttachmentFileData fileData,
        AttachmentFileMetadata metadata,
        AttachmentFileRelation relation,
        CancellationToken cancellationToken = default)
    {
        _db.AttachmentFileData.Add(fileData);
        _db.AttachmentFileMetadata.Add(metadata);
        _db.AttachmentFileRelation.Add(relation);
        await _db.SaveChangesAsync(cancellationToken);
        return metadata;
    }

    public async Task DeleteAsync(Guid metadataId, CancellationToken cancellationToken = default)
    {
        var metadata = await _db.AttachmentFileMetadata
            .FirstOrDefaultAsync(m => m.Id == metadataId, cancellationToken);

        if (metadata is null) return;

        // Cascade: relations + file data tek FK üzerinden cascade siler.
        _db.AttachmentFileMetadata.Remove(metadata);

        var fileData = await _db.AttachmentFileData
            .FirstOrDefaultAsync(d => d.Id == metadata.FileDataId, cancellationToken);
        if (fileData is not null) _db.AttachmentFileData.Remove(fileData);

        await _db.SaveChangesAsync(cancellationToken);
    }
}
