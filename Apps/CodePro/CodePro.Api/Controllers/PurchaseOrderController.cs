using CodePro.Application.Features.PurchaseOrders.Commands.CreatePurchaseOrder;
using CodePro.Application.Features.PurchaseOrders.Commands.DeletePurchaseOrder;
using CodePro.Application.Features.PurchaseOrders.Commands.UpdatePurchaseOrder;
using CodePro.Application.Features.PurchaseOrders.Queries.GetPurchaseOrder;
using CodePro.Application.Features.PurchaseOrders.Queries.ListPurchaseOrders;
using CodePro.Domain.Authorization;
using Platform.Api.Authorization;
using Platform.Api.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CodePro.Api.Controllers;

[ApiController]
[Route("api/purchase-order")]
public sealed class PurchaseOrderController : ControllerBase
{
    private readonly ISender _sender;

    public PurchaseOrderController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.PurchaseOrderPrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync([FromBody] ListPurchaseOrdersQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("get")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.PurchaseOrderPrivilegeCodes.Read)]
    public async Task<IActionResult> GetAsync([FromBody] GetPurchaseOrderQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.PurchaseOrderPrivilegeCodes.Create)]
    public async Task<IActionResult> CreateAsync([FromBody] CreatePurchaseOrderCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("update")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.PurchaseOrderPrivilegeCodes.Update)]
    public async Task<IActionResult> UpdateAsync([FromBody] UpdatePurchaseOrderCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("delete")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.PurchaseOrderPrivilegeCodes.Delete)]
    public async Task<IActionResult> DeleteAsync([FromBody] DeletePurchaseOrderCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);
}
