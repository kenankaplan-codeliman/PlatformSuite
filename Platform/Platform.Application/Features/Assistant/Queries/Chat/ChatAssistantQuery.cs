using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Assistant;
using Platform.Application.Modals.Common;

namespace Platform.Application.Features.Assistant.Queries.Chat;

/// <summary>
/// Asistan sohbet turu. <b>IQuery</b> olarak modellenir (IBaseCommand DEĞİL): handler kendisi
/// DB'ye yazmaz, yazma işlerini araçlar üzerinden ayrı ICommand'lara delege eder. Böylece
/// TransactionBehavior burada ambient bir transaction AÇMAZ; her aracın komutu (CreateLead,
/// ImportLeads) kendi transaction'ını yönetir. (UnitOfWork.BeginTransactionAsync reentrant
/// olmadığından dıştan transaction açmak iç komutta hata verirdi.)
/// </summary>
public sealed class ChatAssistantQuery : IQuery<ChatAssistantResult>
{
    public string Message { get; init; } = string.Empty;

    /// <summary>Kartvizit görseli veya CSV draft attachment id'si (opsiyonel).</summary>
    public Guid? AttachmentId { get; init; }

    /// <summary>Önceki turlar (stateless — istemci taşır).</summary>
    public List<AssistantTurn> History { get; init; } = new();
}

public sealed class ChatAssistantResult
{
    public string Reply { get; set; } = string.Empty;
    public List<EntityReference> Links { get; set; } = new();
    public List<AssistantTurn> History { get; set; } = new();

    /// <summary>Kullanıcı onayı bekleyen yazma işlemleri (token + özet). İstemci Onayla/İptal gösterir.</summary>
    public List<PendingAction> PendingActions { get; set; } = new();
}
