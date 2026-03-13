using CRM.Application.Interfaces;
using CRM.Application.Modals.Common;
using CRM.Domain.Entities.Common;
using CRM.Domain.Enums;
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

    // ── Ownership WHERE koşulu — IOwnedEntity ise filtre ekler ───────────
    protected IQueryable<T> WithOwnerFilter(IQueryable<T> query)
    {
        if (!typeof(IOwnedEntity).IsAssignableFrom(typeof(T)))
            return query;

        // dbContext.IsUserAccess / IsOrgAccess / CurrentUserId / OrgIds
        // PrivilegeAuthorizationHandler'da set edilen değerler — request'e özel
        if (dbContext.IsUserAccess)
            return query.Where(e =>
                EF.Property<Guid>(e, nameof(IOwnedEntity.OwnerId)) == dbContext.CurrentUserId);

        if (dbContext.IsOrgAccess)
            return query.Where(e =>
                dbContext.OrgIds.Contains(EF.Property<Guid>(e, nameof(IOwnedEntity.OrganizationId))));

        return query; // AccessLevel.All — filtre yok
    }

    // ── SetStatusAsync ────────────────────────────────────────────────────
    public virtual async Task SetStateAsync(
        IEnumerable<Guid> entityIds, bool isActive, CancellationToken cancellationToken = default)
    {
        var query = dbSet.Where(e => entityIds.Contains(e.Id));

        // IOwnedEntity ise ownership koşulu eklenir
        query = WithOwnerFilter(query);

        var updated = await query.ExecuteUpdateAsync(
            s => s.SetProperty(
                e => EF.Property<bool>(e, nameof(IBaseEntity.IsActive)), isActive),
            cancellationToken);

        if (updated == 0)
            throw new KeyNotFoundException(
                $"{typeof(T).Name} not found or access denied.");
    }

    // ── AssignAsync ───────────────────────────────────────────────────────
    public virtual async Task AssignAsync(
        IEnumerable<Guid> entityIds, Guid newOwnerId, CancellationToken cancellationToken = default)
    {
        if (!typeof(IOwnedEntity).IsAssignableFrom(typeof(T)))
            throw new InvalidOperationException(
                $"{typeof(T).Name} does not implement IOwnedEntity.");

        var user = await dbContext.AppUser
            .AsNoTracking()
            .Where(u => u.Id == newOwnerId)
            .Select(u => new { u.OrganizationId })
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new KeyNotFoundException($"User with id {newOwnerId} not found.");

        var query = dbSet.Where(e => entityIds.Contains(e.Id));

        // Assign'dan önce mevcut kaydın sahibi olup olmadığı kontrol edilir
        query = WithOwnerFilter(query);

        var updated = await query.ExecuteUpdateAsync(
            s => s
                .SetProperty(e => EF.Property<Guid>(e, nameof(IOwnedEntity.OwnerId)), newOwnerId)
                .SetProperty(e => EF.Property<Guid>(e, nameof(IOwnedEntity.OrganizationId)), user.OrganizationId),
            cancellationToken);

        if (updated == 0)
            throw new KeyNotFoundException(
                $"{typeof(T).Name} not found or access denied.");
    }

    // ── GetAuditInfoAsync ─────────────────────────────────────────────────
    /// <summary>
    /// Entity'nin IOwnedEntity ve IAuditableEntity alanlarından AuditInfo döner.
    /// T her iki interface'i de implemente etmiyorsa null döner.
    /// </summary>
    public virtual async Task<AuditInfo?> GetAuditInfoAsync(Guid id, CancellationToken cancellationToken = default)
    {
        // Her iki interface de implemente edilmeli
        if (!typeof(IOwnedEntity).IsAssignableFrom(typeof(T)) ||
            !typeof(IAuditableEntity).IsAssignableFrom(typeof(T)))
            return null;

        // Entity'den sadece audit için gereken alanları çek
        var raw = await dbSet
            .AsNoTracking()
            .Where(e => e.Id == id)
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