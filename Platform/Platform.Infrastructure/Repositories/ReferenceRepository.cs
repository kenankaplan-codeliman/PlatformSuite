using Platform.Application.Common.References;
using Platform.Application.Interfaces;
using Platform.Application.Modals.Common;

namespace Platform.Infrastructure.Repositories;

/// <summary>
/// Polimorfik EntityReference koordinatörü. Her entity türü için
/// kayıtlı IEntityReferenceResolver'a delegasyon yapar; resolver yoksa
/// id+entityType ile yer tutucu (placeholder) bir EntityReference döner.
/// </summary>
public class ReferenceRepository : IReferenceRepository
{
    private readonly IEntityReferenceResolverRegistry registry;

    public ReferenceRepository(IEntityReferenceResolverRegistry registry)
    {
        this.registry = registry;
    }

    public EntityReference GetReference(string entityType, Guid id)
    {
        var resolver = registry.GetResolver(entityType);
        if (resolver == null)
        {
            return new EntityReference(entityType)
            {
                Id = id,
                Name = entityType,
            };
        }

        return resolver.GetReference(id);
    }

    public EntityReferenceList LookupReference(string entityType, string searchText, PaginationInfo paginationInfo)
    {
        var resolver = registry.GetResolver(entityType);
        if (resolver == null)
        {
            return new EntityReferenceList
            {
                Data = new List<EntityReference>(),
                HasMore = false,
                Page = paginationInfo?.Page ?? 1,
                PageSize = paginationInfo?.PageSize ?? 0,
            };
        }

        return resolver.LookupReference(searchText, paginationInfo);
    }
}
