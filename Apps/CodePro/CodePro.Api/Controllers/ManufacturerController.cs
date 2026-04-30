using CodePro.Application.Features.Manufacturers.Commands.CreateManufacturer;
using CodePro.Application.Features.Manufacturers.Commands.DeleteManufacturer;
using CodePro.Application.Features.Manufacturers.Commands.UpdateManufacturer;
using CodePro.Application.Features.Manufacturers.Queries.GetManufacturer;
using CodePro.Application.Features.Manufacturers.Queries.ListManufacturers;
using CodePro.Domain.Authorization;
using Platform.Api.Authorization;
using Platform.Api.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CodePro.Api.Controllers;

[ApiController]
[Route("api/manufacturer")]
public sealed class ManufacturerController : ControllerBase
{
    private readonly ISender _sender;

    public ManufacturerController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ManufacturerPrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync([FromBody] ListManufacturersQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("get")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ManufacturerPrivilegeCodes.Read)]
    public async Task<IActionResult> GetAsync([FromBody] GetManufacturerQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ManufacturerPrivilegeCodes.Create)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateManufacturerCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("update")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ManufacturerPrivilegeCodes.Update)]
    public async Task<IActionResult> UpdateAsync([FromBody] UpdateManufacturerCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("delete")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ManufacturerPrivilegeCodes.Delete)]
    public async Task<IActionResult> DeleteAsync([FromBody] DeleteManufacturerCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);
}
