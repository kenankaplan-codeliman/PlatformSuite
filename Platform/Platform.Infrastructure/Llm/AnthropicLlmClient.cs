using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using Platform.Application.Common.Llm;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Platform.Infrastructure.Llm;

/// <summary>
/// ILlmClient'ın Anthropic (Claude) implementasyonu — Messages API'ye (/v1/messages) ham HTTP
/// ile gider. Sağlayıcı-nötr LlmRequest/LlmResponse'u Anthropic wire formatına çevirir. Yeni bir
/// sağlayıcı eklemek için ayrı bir ILlmClient implementasyonu yazılır; DI'da tek satır değişir.
/// API key, base url ve anthropic-version header'ları typed HttpClient kaydında set edilir.
/// </summary>
public sealed class AnthropicLlmClient : ILlmClient
{
    private readonly HttpClient _http;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AnthropicLlmClient> _logger;

    public AnthropicLlmClient(HttpClient http, IConfiguration configuration, ILogger<AnthropicLlmClient> logger)
    {
        _http = http;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<LlmResponse> CompleteAsync(LlmRequest request, CancellationToken cancellationToken = default)
    {
        var apiKey = _configuration["Anthropic:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
            throw new InvalidOperationException(
                "Anthropic API anahtarı yapılandırılmamış. .env dosyasına 'Anthropic__ApiKey=...' ekleyin.");

        var body = new JsonObject
        {
            ["model"] = request.Model,
            ["max_tokens"] = request.MaxTokens,
        };

        // System bloğu cache_control ile işaretlenir → tools + system prefix'i sonraki
        // tur/iterasyonlarda cache'ten okunur (~0.1x maliyet). (Min. cacheable prefix
        // eşiğinin altındaysa sessizce devre dışı kalır, ekstra ücret olmaz.)
        if (!string.IsNullOrWhiteSpace(request.System))
            body["system"] = new JsonArray
            {
                new JsonObject
                {
                    ["type"] = "text",
                    ["text"] = request.System,
                    ["cache_control"] = new JsonObject { ["type"] = "ephemeral" },
                },
            };

        if (!string.IsNullOrWhiteSpace(request.Effort))
            body["output_config"] = new JsonObject { ["effort"] = request.Effort };

        if (request.Tools.Count > 0)
        {
            var tools = new JsonArray();
            foreach (var tool in request.Tools)
            {
                tools.Add(new JsonObject
                {
                    ["name"] = tool.Name,
                    ["description"] = tool.Description,
                    ["input_schema"] = JsonNode.Parse(tool.InputSchemaJson),
                });
            }

            body["tools"] = tools;
        }

        var messages = new JsonArray();
        foreach (var message in request.Messages)
            messages.Add(SerializeMessage(message));

        // Son mesajın son bloğuna cache breakpoint → büyüyen konuşma/araç-sonucu geçmişi
        // sonraki çağrıda cache'ten okunur.
        if (messages.Count > 0 &&
            messages[^1] is JsonObject lastMessage &&
            lastMessage["content"] is JsonArray lastContent &&
            lastContent.Count > 0 &&
            lastContent[^1] is JsonObject lastBlock)
        {
            lastBlock["cache_control"] = new JsonObject { ["type"] = "ephemeral" };
        }

        body["messages"] = messages;

        using var content = new StringContent(body.ToJsonString(), Encoding.UTF8, "application/json");
        using var httpRequest = new HttpRequestMessage(HttpMethod.Post, "/v1/messages") { Content = content };
        httpRequest.Headers.TryAddWithoutValidation("x-api-key", apiKey);

        using var httpResponse = await _http.SendAsync(httpRequest, cancellationToken);
        var json = await httpResponse.Content.ReadAsStringAsync(cancellationToken);

        if (!httpResponse.IsSuccessStatusCode)
        {
            _logger.LogError("Anthropic API hata {Status}: {Body}", (int)httpResponse.StatusCode, json);
            throw new InvalidOperationException($"Anthropic API hatası ({(int)httpResponse.StatusCode}).");
        }

        return ParseResponse(json, request.Model);
    }

    private static JsonObject SerializeMessage(LlmMessage message)
    {
        var content = new JsonArray();
        foreach (var block in message.Content)
            content.Add(SerializeBlock(block));

        return new JsonObject
        {
            ["role"] = message.Role,
            ["content"] = content,
        };
    }

    private static JsonNode SerializeBlock(LlmContentBlock block) => block.Type switch
    {
        "image" => new JsonObject
        {
            ["type"] = "image",
            ["source"] = new JsonObject
            {
                ["type"] = "base64",
                ["media_type"] = block.MediaType ?? "image/jpeg",
                ["data"] = block.Base64Data ?? string.Empty,
            },
        },
        "tool_use" => new JsonObject
        {
            ["type"] = "tool_use",
            ["id"] = block.ToolUseId,
            ["name"] = block.ToolName,
            ["input"] = string.IsNullOrWhiteSpace(block.InputJson)
                ? new JsonObject()
                : JsonNode.Parse(block.InputJson),
        },
        "tool_result" => new JsonObject
        {
            ["type"] = "tool_result",
            ["tool_use_id"] = block.ToolResultForId,
            ["content"] = block.Text ?? string.Empty,
            ["is_error"] = block.IsError,
        },
        _ => new JsonObject
        {
            ["type"] = "text",
            ["text"] = block.Text ?? string.Empty,
        },
    };

    private static LlmResponse ParseResponse(string json, string fallbackModel)
    {
        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;

        var stopReason = root.TryGetProperty("stop_reason", out var sr)
            ? sr.GetString() ?? "end_turn"
            : "end_turn";

        var model = root.TryGetProperty("model", out var m)
            ? m.GetString() ?? fallbackModel
            : fallbackModel;

        var blocks = new List<LlmContentBlock>();
        if (root.TryGetProperty("content", out var contentEl) && contentEl.ValueKind == JsonValueKind.Array)
        {
            foreach (var item in contentEl.EnumerateArray())
            {
                var type = item.TryGetProperty("type", out var t) ? t.GetString() : null;
                switch (type)
                {
                    case "text":
                        blocks.Add(LlmContentBlock.TextBlock(
                            item.TryGetProperty("text", out var txt) ? txt.GetString() ?? string.Empty : string.Empty));
                        break;
                    case "tool_use":
                        blocks.Add(LlmContentBlock.ToolUse(
                            item.GetProperty("id").GetString() ?? string.Empty,
                            item.GetProperty("name").GetString() ?? string.Empty,
                            item.TryGetProperty("input", out var input) ? input.GetRawText() : "{}"));
                        break;
                    // thinking vb. blokları v1'de yok sayılır (thinking kapalı çalışılır).
                }
            }
        }

        return new LlmResponse
        {
            StopReason = stopReason,
            Model = model,
            Content = blocks,
        };
    }
}
