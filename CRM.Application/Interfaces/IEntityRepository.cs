using CRM.Domain.Entities.Common;

namespace CRM.Application.Interfaces;



public interface IEntityRepository<T> where T : class, IBaseEntity
{
    // Her entity repository'si kendi implementasyonunu sağlar
    Task<T?> GetAsync(Guid Id, CancellationToken cancellationToken = default);

    // Ortak implementasyonlar BaseEntityRepository'de
    Task<T> CreateAsync(T entity, CancellationToken cancellationToken = default);
    Task<T> UpdateAsync(T entity, CancellationToken cancellationToken = default);
    Task<T> DeleteAsync(T entity, CancellationToken cancellationToken = default);

    // Sadece IOwnedEntity'ler için — servis katmanında rol kontrolü yapıldıktan sonra çağrılır
    Task AssignAsync(Guid entityId, Guid ownerId, CancellationToken cancellationToken = default);
}
