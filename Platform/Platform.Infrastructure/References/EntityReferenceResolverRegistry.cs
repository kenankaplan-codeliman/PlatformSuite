using Platform.Application.Common.References;

namespace Platform.Infrastructure.References;

public class EntityReferenceResolverRegistry : IEntityReferenceResolverRegistry
{
    private readonly Dictionary<string, IEntityReferenceResolver> resolvers;

    public EntityReferenceResolverRegistry(IEnumerable<IEntityReferenceResolver> resolvers)
    {
        this.resolvers = resolvers.ToDictionary(r => r.EntityType, StringComparer.Ordinal);
    }

    public IEntityReferenceResolver? GetResolver(string entityType) =>
        resolvers.TryGetValue(entityType, out var resolver) ? resolver : null;

    public IReadOnlyCollection<string> RegisteredTypes => resolvers.Keys.ToList();
}
