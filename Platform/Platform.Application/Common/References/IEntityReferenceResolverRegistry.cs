namespace Platform.Application.Common.References;

/// <summary>
/// EntityType → IEntityReferenceResolver eşlemesini tutan registry.
/// DI'a kaydedilen tüm IEntityReferenceResolver implementasyonları
/// otomatik olarak toplanır ve EntityType anahtarıyla aranır.
/// </summary>
public interface IEntityReferenceResolverRegistry
{
    IEntityReferenceResolver? GetResolver(string entityType);

    IReadOnlyCollection<string> RegisteredTypes { get; }
}
