namespace Platform.Application.Common.Metadata;

/// <summary>
/// App başına TEK implementasyon. İlgili app DbContext'i içindeki — IBaseEntity /
/// IOwnedEntity / IAuditableEntity implemente eden — herhangi bir entity'nin ortak
/// metadata'sını generic olarak çözer (entity tipi string ile gelir, resolver kendi
/// model'inden CLR tipini bulur). Tanımadığı tip için <c>null</c> döner.
///
/// Platform.Infrastructure değil app Infrastructure'ında yaşar (CrmDbContext /
/// CodeProDbContext'e erişmesi gerekir). DI'da IEnumerable olarak toplanır;
/// GetEntityMetadataHandler ilk null-olmayan sonucu döndürür.
///
/// Yeni entity eklendiğinde sıfır iş: marker interface'leri implemente eden ve
/// DbSet'i olan her entity otomatik kapsanır.
/// </summary>
public interface IEntityMetadataResolver
{
    Task<EntityMetadata?> TryResolveAsync(string entityType, Guid id, CancellationToken cancellationToken = default);
}
