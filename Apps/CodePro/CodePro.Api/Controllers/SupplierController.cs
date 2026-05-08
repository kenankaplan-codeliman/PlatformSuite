using CodePro.Application.Features.Suppliers.Commands.CreateSupplier;
using CodePro.Application.Features.Suppliers.Commands.DeleteSupplier;
using CodePro.Application.Features.Suppliers.Commands.UpdateSupplier;
using CodePro.Application.Features.Suppliers.Queries.GetSupplier;
using CodePro.Application.Features.Suppliers.Queries.ListSuppliers;
using CodePro.Domain.Authorization;
using Platform.Api.Authorization;
using Platform.Api.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CodePro.Api.Controllers;

[ApiController]
[Route("api/supplier")]
public sealed class SupplierController : ControllerBase
{
    private readonly ISender _sender;

    public SupplierController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.SupplierPrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync([FromBody] ListSuppliersQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("get")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.SupplierPrivilegeCodes.Read)]
    public async Task<IActionResult> GetAsync([FromBody] GetSupplierQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.SupplierPrivilegeCodes.Create)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateSupplierCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("update")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.SupplierPrivilegeCodes.Update)]
    public async Task<IActionResult> UpdateAsync([FromBody] UpdateSupplierCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("delete")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.SupplierPrivilegeCodes.Delete)]
    public async Task<IActionResult> DeleteAsync([FromBody] DeleteSupplierCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);
}
