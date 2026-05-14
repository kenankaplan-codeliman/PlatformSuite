using Platform.Application.Common.Numbering;

namespace Platform.Infrastructure.Numbering;

/// <summary>
/// DI'a kayıtlı tüm <see cref="INumberFormatStrategy"/> implementasyonlarını
/// doküman tipine göre dictionary'e çevirir. <see cref="EntityReferenceResolverRegistry"/>
/// ile aynı registry mekanizması — her uygulama kendi strategy'lerini kaydeder,
/// resolver runtime'da otomatik genişler.
/// </summary>
public class NumberFormatStrategyResolver : INumberFormatStrategyResolver
{
    private readonly IReadOnlyDictionary<string, INumberFormatStrategy> _strategies;

    public NumberFormatStrategyResolver(IEnumerable<INumberFormatStrategy> strategies)
    {
        _strategies = strategies.ToDictionary(
            s => s.DocumentType.ToUpperInvariant(),
            s => s,
            StringComparer.OrdinalIgnoreCase);
    }

    public INumberFormatStrategy Resolve(string documentType)
    {
        var key = documentType.ToUpperInvariant();
        if (!_strategies.TryGetValue(key, out var strategy))
        {
            throw new InvalidOperationException(
                $"No format strategy registered for document type '{documentType}'. " +
                $"Registered types: {string.Join(", ", _strategies.Keys)}");
        }

        return strategy;
    }
}
