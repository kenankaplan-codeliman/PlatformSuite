namespace Platform.Application.Common.Llm;

/// <summary>
/// Sağlayıcı-bağımsız LLM istemcisi. Tek tur (single-shot) tamamlama yapar; agentic döngü
/// <c>IAssistantOrchestrator</c> tarafından yürütülür. Yeni bir sağlayıcı eklemek = yeni bir
/// implementasyon + DI'da tek satır kayıt (lookup search resolver registry mantığıyla aynı).
/// </summary>
public interface ILlmClient
{
    Task<LlmResponse> CompleteAsync(LlmRequest request, CancellationToken cancellationToken = default);
}
