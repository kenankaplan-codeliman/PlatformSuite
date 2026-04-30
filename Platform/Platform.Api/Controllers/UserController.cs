using Platform.Api.Authorization;
using Platform.Api.Extensions;
using Platform.Application.Features.AppUsers.Commands.ChangeAppUserPassword;
using Platform.Application.Features.AppUsers.Commands.CreateAppUser;
using Platform.Application.Features.AppUsers.Commands.DeleteAppUser;
using Platform.Application.Features.AppUsers.Commands.UpdateAppUser;
using Platform.Application.Features.AppUsers.Commands.UpdateAppUserRoles;
using Platform.Application.Features.AppUsers.Queries.GetAppUser;
using Platform.Application.Features.AppUsers.Queries.ListAppUsers;
using Platform.Application.Features.Users.Queries.SearchUsers;
using Platform.Domain.Authorization;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Platform.Api.Controllers;

[ApiController]
[Route("api/user")]
public sealed class UserController : ControllerBase
{
    private readonly ISender _sender;

    public UserController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(PrivilegeCodes.UserPrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync([FromBody] ListAppUsersQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("get")]
    [PrivilegeAuthorize(PrivilegeCodes.UserPrivilegeCodes.Read)]
    public async Task<IActionResult> GetAsync([FromBody] GetAppUserQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create")]
    [PrivilegeAuthorize(PrivilegeCodes.UserPrivilegeCodes.Create)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateAppUserCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("update")]
    [PrivilegeAuthorize(PrivilegeCodes.UserPrivilegeCodes.Update)]
    public async Task<IActionResult> UpdateAsync([FromBody] UpdateAppUserCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("delete")]
    [PrivilegeAuthorize(PrivilegeCodes.UserPrivilegeCodes.Delete)]
    public async Task<IActionResult> DeleteAsync([FromBody] DeleteAppUserCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("update-roles")]
    [PrivilegeAuthorize(PrivilegeCodes.UserPrivilegeCodes.Update)]
    public async Task<IActionResult> UpdateRolesAsync([FromBody] UpdateAppUserRolesCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("change-password")]
    [PrivilegeAuthorize(PrivilegeCodes.UserPrivilegeCodes.Update)]
    public async Task<IActionResult> ChangePasswordAsync([FromBody] ChangeAppUserPasswordCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("search")]
    [PrivilegeAuthorize(PrivilegeCodes.UserPrivilegeCodes.Read)]
    public async Task<IActionResult> SearchAsync([FromBody] SearchUsersQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);
}
