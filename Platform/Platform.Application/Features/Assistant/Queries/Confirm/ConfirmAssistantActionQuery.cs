using Platform.Application.Common.Abstractions;
using Platform.Application.Modals.Common;

namespace Platform.Application.Features.Assistant.Queries.Confirm;

/// <summary>
/// Kullanıcının onayladığı yazma işlemini çalıştırır. Token, çalıştırılacak aracı + argümanları +
/// kullanıcıyı + (varsa) eki bağlar; gerçek çalıştırma modelin yeniden kararına değil, kullanıcının
/// onayladığı tam yüke dayanır. <b>IQuery</b> (IBaseCommand DEĞİL): handler kendisi DB'ye yazmaz,
/// yazma işini aracın kendi ICommand'ına delege eder (nested transaction'ı önlemek için).
/// </summary>
public sealed class ConfirmAssistantActionQuery : IQuery<ConfirmAssistantResult>
{
    public string Token { get; init; } = string.Empty;
}

public sealed class ConfirmAssistantResult
{
    public string Reply { get; set; } = string.Empty;
    public List<EntityReference> Links { get; set; } = new();
    public bool IsError { get; set; }
}
