using Platform.Application.Features.UserPreferences.Commands.SaveUserPreference;
using Platform.Application.Features.UserPreferences.Queries.GetUserPreference;
using Platform.Api.Authorization;
using Platform.Api.Extensions;
using Platform.Domain.Authorization;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Platform.Api.Controllers;

/// <summary>
/// Generic kullanıcı tercihi (anahtar bazlı, opak JSON value) — dashboard layout vb.
/// Kullanıcı yalnız kendi tercihini yönetir; tek privilege Preference.Manage.
/// </summary>
[ApiController]
[Route("api/preference")]
public sealed class PreferenceController : ControllerBase
{
    private readonly ISender _sender;

    public PreferenceController(ISender sender) => _sender = sender;

    [HttpPost("get")]
    [PrivilegeAuthorize(PrivilegeCodes.PreferencePrivilegeCodes.Manage)]
    public async Task<IActionResult> GetAsync([FromBody] GetUserPreferenceQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("save")]
    [PrivilegeAuthorize(PrivilegeCodes.PreferencePrivilegeCodes.Manage)]
    public async Task<IActionResult> SaveAsync([FromBody] SaveUserPreferenceCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);
}
