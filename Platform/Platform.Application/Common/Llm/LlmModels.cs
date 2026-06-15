namespace Platform.Application.Common.Llm;

/// <summary>
/// Sağlayıcı-bağımsız LLM istek/yanıt modeli. Anthropic/Azure gibi sağlayıcı tipleri
/// Application katmanına sızmaz; <see cref="ILlmClient"/> implementasyonu bu nötr modeli
/// kendi wire formatına çevirir. Asistan orchestrator yalnız bu tiplere bağlıdır.
/// </summary>
public sealed class LlmRequest
{
    public string Model { get; init; } = string.Empty;
    public string? System { get; init; }
    public List<LlmMessage> Messages { get; init; } = new();
    public List<LlmToolDefinition> Tools { get; init; } = new();
    public int MaxTokens { get; init; } = 16000;

    /// <summary>low | medium | high | xhigh | max — sağlayıcı destekliyorsa iletilir.</summary>
    public string? Effort { get; init; }
}

public sealed class LlmMessage
{
    public LlmMessage() { }

    public LlmMessage(string role, List<LlmContentBlock> content)
    {
        Role = role;
        Content = content;
    }

    /// <summary>"user" | "assistant"</summary>
    public string Role { get; init; } = "user";
    public List<LlmContentBlock> Content { get; init; } = new();
}

/// <summary>
/// Çok-biçimli içerik bloğu. Tür <see cref="Type"/> ile ayrılır; ilgili alanlar doldurulur.
/// Sağlayıcıya özel "thinking" gibi bloklar v1'de kullanılmaz (thinking kapalı çalışılır),
/// böylece tur-arası blok yeniden gönderim karmaşıklığı oluşmaz.
/// </summary>
public sealed class LlmContentBlock
{
    /// <summary>"text" | "image" | "tool_use" | "tool_result"</summary>
    public string Type { get; init; } = "text";

    // text / tool_result içerik
    public string? Text { get; init; }

    // image
    public string? MediaType { get; init; }
    public string? Base64Data { get; init; }

    // tool_use (asistan yanıtı)
    public string? ToolUseId { get; init; }
    public string? ToolName { get; init; }
    public string? InputJson { get; init; }

    // tool_result (kullanıcı turu)
    public string? ToolResultForId { get; init; }
    public bool IsError { get; init; }

    public static LlmContentBlock TextBlock(string text) =>
        new() { Type = "text", Text = text };

    public static LlmContentBlock Image(string mediaType, string base64Data) =>
        new() { Type = "image", MediaType = mediaType, Base64Data = base64Data };

    public static LlmContentBlock ToolUse(string id, string name, string inputJson) =>
        new() { Type = "tool_use", ToolUseId = id, ToolName = name, InputJson = inputJson };

    public static LlmContentBlock ToolResult(string toolUseId, string text, bool isError) =>
        new() { Type = "tool_result", ToolResultForId = toolUseId, Text = text, IsError = isError };
}

public sealed class LlmToolDefinition
{
    public LlmToolDefinition() { }

    public LlmToolDefinition(string name, string description, string inputSchemaJson)
    {
        Name = name;
        Description = description;
        InputSchemaJson = inputSchemaJson;
    }

    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string InputSchemaJson { get; init; } = "{}";
}

public sealed class LlmResponse
{
    /// <summary>"end_turn" | "tool_use" | "max_tokens" | "refusal" | ...</summary>
    public string StopReason { get; init; } = "end_turn";
    public string Model { get; init; } = string.Empty;
    public List<LlmContentBlock> Content { get; init; } = new();
}
