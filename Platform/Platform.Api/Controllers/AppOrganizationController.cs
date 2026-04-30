using Platform.Api.Authorization;
using Platform.Api.Extensions;
using Platform.Application.Features.AppOrganizations.Commands.CreateAppOrganization;
using Platform.Application.Features.AppOrganizations.Commands.DeleteAppOrganization;
using Platform.Application.Features.AppOrganizations.Commands.UpdateAppOrganization;
using Platform.Application.Features.AppOrganizations.Queries.GetAppOrganization;
using Platform.Application.Features.AppOrganizations.Queries.ListAppOrganizations;
using Platform.Domain.Authorization;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Platform.Api.Controllers;

[ApiController]
[Route("api/app-organization")]
public sealed class AppOrganizationController : ControllerBase
{
    private readonly ISender _sender;

    public AppOrganizationController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(PrivilegeCodes.AppOrganizationPrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync([FromBody] ListAppOrganizationsQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("get")]
    [PrivilegeAuthorize(PrivilegeCodes.AppOrganizationPrivilegeCodes.Read)]
    public async Task<IActionResult> GetAsync([FromBody] GetAppOrganizationQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create")]
    [PrivilegeAuthorize(PrivilegeCodes.AppOrganizationPrivilegeCodes.Create)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateAppOrganizationCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("update")]
    [PrivilegeAuthorize(PrivilegeCodes.AppOrganizationPrivilegeCodes.Update)]
    public async Task<IActionResult> UpdateAsync([FromBody] UpdateAppOrganizationCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("delete")]
    [PrivilegeAuthorize(PrivilegeCodes.AppOrganizationPrivilegeCodes.Delete)]
    public async Task<IActionResult> DeleteAsync([FromBody] DeleteAppOrganizationCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);
}
