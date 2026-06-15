using Platform.Api.Authorization;
using Platform.Api.Extensions;
using Platform.Application.Features.Assistant.Queries.Chat;
using Platform.Application.Features.Assistant.Queries.Confirm;
using Platform.Domain.Authorization;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Platform.Api.Controllers;

/// <summary>
/// AI Asistan sohbet endpoint'i. Çekirdek/framework Platform'da; iş fonksiyonları (araçlar)
/// üst uygulamaların Infrastructure projelerinde IAssistantTool olarak kayıtlıdır ve registry
/// üzerinden çözülür. Bu controller CRM host'una AddApplicationPart ile dahil olur.
/// </summary>
[ApiController]
[Route("api/assistant")]
public sealed class AssistantController : ControllerBase
{
    private readonly ISender _sender;

    public AssistantController(ISender sender) => _sender = sender;

    [HttpPost("chat")]
    [PrivilegeAuthorize(PrivilegeCodes.AssistantPrivilegeCodes.Use)]
    public async Task<IActionResult> ChatAsync([FromBody] ChatAssistantQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    /// <summary>
    /// Kullanıcının onayladığı yazma işlemini (imzalı token) çalıştırır. Yazma araçları yalnız bu
    /// uçtan, kullanıcının açık onayıyla yürür; model bunları doğrudan çalıştıramaz.
    /// </summary>
    [HttpPost("confirm")]
    [PrivilegeAuthorize(PrivilegeCodes.AssistantPrivilegeCodes.Use)]
    public async Task<IActionResult> ConfirmAsync([FromBody] ConfirmAssistantActionQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);
}
