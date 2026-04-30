using Platform.Application.Interfaces;
using Platform.Application.Modals.Common;
using Platform.Domain.Entities.Common;
using Platform.Domain.Enums;
using Platform.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Platform.Infrastructure.Repositories;

public class AuditRepository : IAuditRepository
{
    protected readonly PlatformDbContext dbContext;

    public AuditRepository(PlatformDbContext context)
    {
        dbContext = context;
    }

    public async Task<AuditInfo?> GetAsync<T>(Guid Id, CancellationToken cancellationToken = default)
        where T : class, IBaseEntity
    {
        // Her iki interface de implemente edilmeli
        if (!typeof(IOwnedEntity).IsAssignableFrom(typeof(T)) ||
            !typeof(IAuditableEntity).IsAssignableFrom(typeof(T)))
            return null;

        var dbSet = dbContext.Set<T>();

        // Entity'den sadece audit için gereken alanları çek
        var raw = await dbSet
            .AsNoTracking()
            .Where(e => e.Id == Id)
            .Select(e => new
            {
                OwnerId = EF.Property<Guid>(e, nameof(IOwnedEntity.OwnerId)),
                CreatedBy = EF.Property<Guid>(e, nameof(IAuditableEntity.CreatedBy)),
                CreatedAt = EF.Property<DateTime>(e, nameof(IAuditableEntity.CreatedAt)),
                UpdatedBy = EF.Property<Guid?>(e, nameof(IAuditableEntity.UpdatedBy)),
                UpdatedAt = EF.Property<DateTime?>(e, nameof(IAuditableEntity.UpdatedAt)),
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (raw is null) return null;

        // İlgili user Id'lerini tek sorguda çek
        var userIds = new[] { raw.OwnerId, raw.CreatedBy }
            .Concat(raw.UpdatedBy.HasValue ? [raw.UpdatedBy.Value] : Array.Empty<Guid>())
            .Distinct()
            .ToList();

        var users = await dbContext.AppUser
            .AsNoTracking()
            .Where(u => userIds.Contains(u.Id))
            .Select(u => new { u.Id, u.FullName, u.Email })
            .ToDictionaryAsync(u => u.Id, cancellationToken);

        EntityReference? ToRef(Guid? id) =>
            id.HasValue && users.TryGetValue(id.Value, out var u)
                ? new EntityReference(EntityType.User) { Id = id.Value, Name = u.FullName, Email = u.Email }
                : null;

        return new AuditInfo
        {
            Owner = ToRef(raw.OwnerId),
            CreatedBy = ToRef(raw.CreatedBy),
            CreatedAt = raw.CreatedAt,
            UpdatedBy = ToRef(raw.UpdatedBy),
            UpdatedAt = raw.UpdatedAt,
        };
    }
}
