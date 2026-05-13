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

    public async Task<AttachmentFileMetadata> CreateDraftAsync(
        byte[] dataBytes,
        string fileName,
        string contentType,
        long fileSize,
        string documentType,
        string? subject,
        string? description,
        DateTime expiresAt,
        CancellationToken cancellationToken = default)
    {
        var fileData = new AttachmentFileData
        {
            Id = Guid.NewGuid(),
            DataBytes = dataBytes,
        };

        var metadata = new AttachmentFileMetadata
        {
            Id = Guid.NewGuid(),
            FileDataId = fileData.Id,
            FileName = fileName,
            ContentType = contentType,
            FileSize = fileSize,
            DocumentType = documentType,
            Subject = subject,
            Description = description,
            ExpiresAt = expiresAt,
        };

        await _db.AttachmentFileData.AddAsync(fileData, cancellationToken);
        await _db.AttachmentFileMetadata.AddAsync(metadata, cancellationToken);

        return metadata;
    }

    public async Task AssociateAsync(
        IReadOnlyCollection<Guid> metadataIds,
        Guid entityId,
        string entityType,
        CancellationToken cancellationToken = default)
    {
        if (metadataIds.Count == 0) return;

        var metadataList = await _db.AttachmentFileMetadata
            .Where(m => metadataIds.Contains(m.Id))
            .ToListAsync(cancellationToken);

        foreach (var metadata in metadataList)
        {
            metadata.ExpiresAt = null;

            _db.AttachmentFileRelation.Add(new AttachmentFileRelation
            {
                Id = Guid.NewGuid(),
                MetadataId = metadata.Id,
                EntityId = entityId,
                EntityType = entityType,
            });
        }
    }

    public async Task<bool> DeleteAsync(Guid metadataId, CancellationToken cancellationToken = default)
    {
        var metadata = await _db.AttachmentFileMetadata
            .FirstOrDefaultAsync(m => m.Id == metadataId, cancellationToken);

        if (metadata is null) return false;

        var fileData = await _db.AttachmentFileData
            .FirstOrDefaultAsync(d => d.Id == metadata.FileDataId, cancellationToken);

        // file_data → metadata cascade FK olduğu için file_data silmek metadata'yı
        // da kaskat siler; relation tablosu da metadata cascade ile temizlenir.
        if (fileData is not null) _db.AttachmentFileData.Remove(fileData);
        else _db.AttachmentFileMetadata.Remove(metadata);

        return true;
    }

    public async Task<int> DeleteExpiredDraftsAsync(DateTime threshold, CancellationToken cancellationToken = default)
    {
        var expired = await _db.AttachmentFileMetadata
            .Where(m => m.ExpiresAt != null && m.ExpiresAt < threshold)
            .Select(m => new { m.Id, m.FileDataId })
            .ToListAsync(cancellationToken);

        if (expired.Count == 0) return 0;

        var fileDataIds = expired.Select(e => e.FileDataId).ToList();
        var fileDataEntries = await _db.AttachmentFileData
            .Where(d => fileDataIds.Contains(d.Id))
            .ToListAsync(cancellationToken);

        _db.AttachmentFileData.RemoveRange(fileDataEntries);

        // Hosted service MediatR pipeline'ı dışında çalışır — kendi SaveChanges.
        await _db.SaveChangesAsync(cancellationToken);
        return expired.Count;
    }
}
