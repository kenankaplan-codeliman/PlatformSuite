namespace Platform.Application.Common.Assistant;

/// <summary>
/// Name → IAssistantTool eşlemesini tutan registry. DI'a kayıtlı tüm IAssistantTool
/// implementasyonları otomatik toplanır ve <c>Name</c> anahtarıyla aranır.
/// (IEntityReferenceResolverRegistry ile birebir aynı desen.)
/// </summary>
public interface IAssistantToolRegistry
{
    IAssistantTool? GetTool(string name);

    IReadOnlyCollection<IAssistantTool> All { get; }
}
