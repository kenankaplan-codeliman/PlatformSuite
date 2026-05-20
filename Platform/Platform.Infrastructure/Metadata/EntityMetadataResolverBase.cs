using Microsoft.EntityFrameworkCore;
using Platform.Application.Common.Metadata;
using Platform.Application.Interfaces;
using Platform.Application.Modals.Common;
using Platform.Domain.Entities.Common;
using Platform.Domain.Entities.Identities;

namespace Platform.Infrastructure.Metadata;

/// <summary>
/// IEntityMetadataResolver'ın generic gövdesi. Verilen entity tipini app DbContext'in
/// EF Core model'inden bulur, Id ile yükler ve ortak marker interface'lerden
/// (IBaseEntity / IAuditableEntity / IOwnedEntity) metadata'yı doldurur.
///
/// App Infrastructure'ları yalnızca kendi DbContext'lerini geçen ince bir alt sınıf yazar;
/// entity başına ek kod gerekmez.
/// </summary>
public abstract class EntityMetadataResolverBase : IEntityMetadataResolver
{
    private static readonly string UserEntityType = nameof(AuthUser);
    private const string OrganizationEntityType = "Organization";

    private readonly DbContext _db;
    private readonly IReferenceRepository _references;

    protected EntityMetadataResolverBase(DbContext db, IReferenceRepository references)
    {
        _db = db;
        _references = references;
    }

    public async Task<EntityMetadata?> TryResolveAsync(string entityType, Guid id, CancellationToken cancellationToken = default)
    {
        var clrType = _db.Model.GetEntityTypes()
            .Select(e => e.ClrType)
            .FirstOrDefault(t => t.Name == entityType && typeof(IBaseEntity).IsAssignableFrom(t));

        // Bu app'in DbContext'inde böyle bir entity yoksa: başka resolver denesin.
        if (clrType is null) return null;

        var entity = await _db.FindAsync(clrType, new object?[] { id }, cancellationToken);
        if (entity is null) return null;

        var metadata = new EntityMetadata();

        if (entity is IBaseEntity baseEntity)
            metadata.IsActive = baseEntity.IsActive;

        if (entity is IAuditableEntity audit)
        {
            metadata.CreatedAt = audit.CreatedAt;
            metadata.UpdatedAt = audit.UpdatedAt;
            metadata.CreatedBy = Resolve(UserEntityType, audit.CreatedBy);
            metadata.UpdatedBy = audit.UpdatedBy.HasValue ? Resolve(UserEntityType, audit.UpdatedBy.Value) : null;
        }

        if (entity is IOwnedEntity owned)
        {
            metadata.Owner = Resolve(UserEntityType, owned.OwnerId);
            metadata.Organization = Resolve(OrganizationEntityType, owned.OrganizationId);
        }

        return metadata;
    }

    // Owner/Organization/audit kullanıcısı silinmiş olabilir — referans çözülemezse
    // o alan null kalır, metadata'nın geri kalanı yine döner.
    private EntityReference? Resolve(string entityType, Guid id)
    {
        if (id == Guid.Empty) return null;
        try
        {
            return _references.GetReference(entityType, id);
        }
        catch
        {
            return null;
        }
    }
}
