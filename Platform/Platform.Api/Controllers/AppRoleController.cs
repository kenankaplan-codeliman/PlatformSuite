using Platform.Api.Authorization;
using Platform.Api.Extensions;
using Platform.Application.Features.AppRoles.Commands.CreateAppRole;
using Platform.Application.Features.AppRoles.Commands.DeleteAppRole;
using Platform.Application.Features.AppRoles.Commands.UpdateAppRole;
using Platform.Application.Features.AppRoles.Queries.GetAppRole;
using Platform.Application.Features.AppRoles.Queries.ListAppRoles;
using Platform.Domain.Authorization;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Platform.Api.Controllers;

[ApiController]
[Route("api/app-role")]
public sealed class AppRoleController : ControllerBase
{
    private readonly ISender _sender;

    public AppRoleController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(PrivilegeCodes.AppRolePrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync([FromBody] ListAppRolesQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("get")]
    [PrivilegeAuthorize(PrivilegeCodes.AppRolePrivilegeCodes.Read)]
    public async Task<IActionResult> GetAsync([FromBody] GetAppRoleQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create")]
    [PrivilegeAuthorize(PrivilegeCodes.AppRolePrivilegeCodes.Create)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateAppRoleCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("update")]
    [PrivilegeAuthorize(PrivilegeCodes.AppRolePrivilegeCodes.Update)]
    public async Task<IActionResult> UpdateAsync([FromBody] UpdateAppRoleCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("delete")]
    [PrivilegeAuthorize(PrivilegeCodes.AppRolePrivilegeCodes.Delete)]
    public async Task<IActionResult> DeleteAsync([FromBody] DeleteAppRoleCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);
}
