using Platform.Application.Modals.Common;

namespace Platform.Application.Common.Assistant;

/// <summary>
/// Asistanın çağırabileceği bir iş fonksiyonu. Platform yalnız kontratı tanımlar; somut
/// araçlar (kartvizit→Lead, CSV import, analitik, lookup) üst uygulamaların (CRM, CodePro)
/// Infrastructure projelerinde yaşar ve <c>AddScoped&lt;IAssistantTool, ...&gt;()</c> ile
/// kaydedilir. <see cref="IAssistantToolRegistry"/> bunları <see cref="Name"/> anahtarıyla
/// otomatik toplar (IEntityReferenceResolver registry deseninin birebir aynısı).
/// </summary>
public interface IAssistantTool
{
    /// <summary>LLM'e iletilen araç adı (polimorfik anahtar), örn "create_lead".</summary>
    string Name { get; }

    /// <summary>Aracın ne yaptığını ve <b>ne zaman çağrılacağını</b> anlatan preskriptif açıklama.</summary>
    string Description { get; }

    /// <summary>Araç argümanlarının JSON Schema'sı (ham string).</summary>
    string InputSchemaJson { get; }

    Task<AssistantToolResult> ExecuteAsync(string argumentsJson, CancellationToken cancellationToken = default);

    /// <summary>
    /// Yan etkili/yazma araçları true döner. Orchestrator bu araçları model döngüsünde
    /// ÇALIŞTIRMAZ; bunun yerine imzalı bir onay talebi üretir ve gerçek çalıştırma ayrı bir
    /// kullanıcı onayı adımında yapılır (prompt-injection'a karşı harness-zorlamalı koruma).
    /// </summary>
    bool RequiresConfirmation => false;

    /// <summary>Onay ekranında kullanıcıya gösterilecek kısa, insan-okur özet.</summary>
    string Summarize(string argumentsJson) => Name;
}

/// <summary>
/// Bir araç çalıştırmasının sonucu. <see cref="Text"/> LLM'e tool_result olarak döner;
/// <see cref="Links"/> kullanıcıya gösterilecek kayıt referanslarını taşır (entity türü + id;
/// URL'ye dönüştürme istemcide app route map ile yapılır).
/// </summary>
public sealed class AssistantToolResult
{
    public string Text { get; init; } = string.Empty;
    public bool IsError { get; init; }
    public List<EntityReference> Links { get; init; } = new();
}
