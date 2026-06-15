using Platform.Application.Modals.Common;

namespace Platform.Application.Common.Assistant;

/// <summary>
/// Asistan agentic döngüsünü yürütür: tool listesini registry'den kurar, LLM'e gönderir,
/// tool_use bloklarını registry üzerinden çalıştırır, end_turn'e kadar döner; metin yanıtı
/// ve toplanan kayıt linklerini döndürür. Ekli dosya (kartvizit/CSV) <see cref="IAssistantRequestContext"/>
/// üzerinden okunur.
/// </summary>
public interface IAssistantOrchestrator
{
    Task<AssistantRunResult> RunAsync(
        string message,
        IReadOnlyList<AssistantTurn> history,
        CancellationToken cancellationToken = default);
}

/// <summary>Bir sohbet turu — istemci ile taşınan basit (role + metin) geçmiş öğesi.</summary>
public sealed class AssistantTurn
{
    public AssistantTurn() { }

    public AssistantTurn(string role, string text)
    {
        Role = role;
        Text = text;
    }

    /// <summary>"user" | "assistant"</summary>
    public string Role { get; init; } = "user";
    public string Text { get; init; } = string.Empty;
}

public sealed class AssistantRunResult
{
    public AssistantRunResult(string reply, List<EntityReference> links, List<PendingAction> pendingActions)
    {
        Reply = reply;
        Links = links;
        PendingActions = pendingActions;
    }

    public string Reply { get; }
    public List<EntityReference> Links { get; }

    /// <summary>Modelin önerdiği ama kullanıcı onayı bekleyen yazma işlemleri.</summary>
    public List<PendingAction> PendingActions { get; }
}

/// <summary>Onay bekleyen bir yazma işlemi — imzalı token + kullanıcıya gösterilecek özet.</summary>
public sealed class PendingAction
{
    public PendingAction(string token, string toolName, string summary)
    {
        Token = token;
        ToolName = toolName;
        Summary = summary;
    }

    public string Token { get; }
    public string ToolName { get; }
    public string Summary { get; }
}
