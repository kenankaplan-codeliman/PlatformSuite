using CRM.Application.Interfaces;
using CRM.Domain.Entities.Common;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Data.Repositories;

public abstract class BaseEntityRepository<T> : IEntityRepository<T>
    where T : class, IBaseEntity
{
    protected readonly DatabaseContext dbContext;
    protected readonly DbSet<T> dbSet;

    protected BaseEntityRepository(DatabaseContext context)
    {
        dbContext = context;
        dbSet = context.Set<T>();
    }

    // ── Abstract: Her repository kendi sorgusunu yazar ────────────────────

    public abstract Task<T?> GetAsync(Guid id, CancellationToken cancellationToken = default);

    // ── Ortak Implementasyonlar ───────────────────────────────────────────
    // OwnerId ve OrganizationId koruması DatabaseContext.ApplyAuditAndSoftDelete()
    // içinde merkezi olarak yönetilir. Burada ek bir işlem gerekmez.

    public virtual async Task<T> CreateAsync(T entity, CancellationToken cancellationToken = default)
    {
        await dbSet.AddAsync(entity, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public virtual async Task<T> UpdateAsync(T entity, CancellationToken cancellationToken = default)
    {
        dbSet.Update(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public virtual async Task<T> DeleteAsync(T entity, CancellationToken cancellationToken = default)
    {
        dbSet.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }

    // ── Assign: Sadece IOwnedEntity'ler için ─────────────────────────────

    public virtual async Task AssignAsync(Guid entityId, Guid ownerId, CancellationToken cancellationToken = default)
    {
        if (!typeof(IOwnedEntity).IsAssignableFrom(typeof(T)))
            throw new InvalidOperationException($"{typeof(T).Name} does not implement IOwnedEntity.");

        var user = await dbContext.AppUser
            .AsNoTracking()
            .Where(u => u.Id == ownerId)
            .Select(u => new { u.OrganizationId })
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new KeyNotFoundException($"User with id {ownerId} not found.");

        var updated = await dbSet
            .Where(e => e.Id == entityId)
            .ExecuteUpdateAsync(s => s
                .SetProperty(e => EF.Property<Guid>(e, nameof(IOwnedEntity.OwnerId)), ownerId)
                .SetProperty(e => EF.Property<Guid>(e, nameof(IOwnedEntity.OrganizationId)), user.OrganizationId),
            cancellationToken);

        if (updated == 0)
            throw new KeyNotFoundException($"{typeof(T).Name} with id {entityId} not found.");
    }
}