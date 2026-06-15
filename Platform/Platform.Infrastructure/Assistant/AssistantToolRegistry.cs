using Platform.Application.Common.Assistant;

namespace Platform.Infrastructure.Assistant;

/// <summary>
/// DI'a kayıtlı tüm IAssistantTool'ları Name anahtarıyla toplar.
/// (EntityReferenceResolverRegistry deseninin birebir aynısı.)
/// </summary>
public sealed class AssistantToolRegistry : IAssistantToolRegistry
{
    private readonly Dictionary<string, IAssistantTool> _tools;

    public AssistantToolRegistry(IEnumerable<IAssistantTool> tools)
    {
        _tools = tools.ToDictionary(t => t.Name, StringComparer.Ordinal);
    }

    public IAssistantTool? GetTool(string name) =>
        _tools.TryGetValue(name, out var tool) ? tool : null;

    public IReadOnlyCollection<IAssistantTool> All => _tools.Values;
}
