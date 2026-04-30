using CodePro.Application.Features.PurchaseRequests.Commands.CreatePurchaseRequest;
using CodePro.Application.Features.PurchaseRequests.Commands.DeletePurchaseRequest;
using CodePro.Application.Features.PurchaseRequests.Commands.UpdatePurchaseRequest;
using CodePro.Application.Features.PurchaseRequests.Queries.GetPurchaseRequest;
using CodePro.Application.Features.PurchaseRequests.Queries.ListPurchaseRequests;
using CodePro.Domain.Authorization;
using Platform.Api.Authorization;
using Platform.Api.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CodePro.Api.Controllers;

[ApiController]
[Route("api/purchase-request")]
public sealed class PurchaseRequestController : ControllerBase
{
    private readonly ISender _sender;

    public PurchaseRequestController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.PurchaseRequestPrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync([FromBody] ListPurchaseRequestsQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("get")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.PurchaseRequestPrivilegeCodes.Read)]
    public async Task<IActionResult> GetAsync([FromBody] GetPurchaseRequestQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.PurchaseRequestPrivilegeCodes.Create)]
    public async Task<IActionResult> CreateAsync([FromBody] CreatePurchaseRequestCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("update")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.PurchaseRequestPrivilegeCodes.Update)]
    public async Task<IActionResult> UpdateAsync([FromBody] UpdatePurchaseRequestCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("delete")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.PurchaseRequestPrivilegeCodes.Delete)]
    public async Task<IActionResult> DeleteAsync([FromBody] DeletePurchaseRequestCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);
}
