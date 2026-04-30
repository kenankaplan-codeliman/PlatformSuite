using CodePro.Application.Features.PurchaseBaskets.Commands.CreatePurchaseBasket;
using CodePro.Application.Features.PurchaseBaskets.Commands.DeletePurchaseBasket;
using CodePro.Application.Features.PurchaseBaskets.Commands.UpdatePurchaseBasket;
using CodePro.Application.Features.PurchaseBaskets.Queries.GetPurchaseBasket;
using CodePro.Application.Features.PurchaseBaskets.Queries.ListPurchaseBaskets;
using CodePro.Domain.Authorization;
using Platform.Api.Authorization;
using Platform.Api.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CodePro.Api.Controllers;

[ApiController]
[Route("api/purchase-basket")]
public sealed class PurchaseBasketController : ControllerBase
{
    private readonly ISender _sender;

    public PurchaseBasketController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.PurchaseBasketPrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync([FromBody] ListPurchaseBasketsQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("get")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.PurchaseBasketPrivilegeCodes.Read)]
    public async Task<IActionResult> GetAsync([FromBody] GetPurchaseBasketQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.PurchaseBasketPrivilegeCodes.Create)]
    public async Task<IActionResult> CreateAsync([FromBody] CreatePurchaseBasketCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("update")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.PurchaseBasketPrivilegeCodes.Update)]
    public async Task<IActionResult> UpdateAsync([FromBody] UpdatePurchaseBasketCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("delete")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.PurchaseBasketPrivilegeCodes.Delete)]
    public async Task<IActionResult> DeleteAsync([FromBody] DeletePurchaseBasketCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);
}
