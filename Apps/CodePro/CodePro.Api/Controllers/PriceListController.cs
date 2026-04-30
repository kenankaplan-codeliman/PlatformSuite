using CodePro.Application.Features.PriceLists.Commands.CreatePriceList;
using CodePro.Application.Features.PriceLists.Commands.DeletePriceList;
using CodePro.Application.Features.PriceLists.Commands.UpdatePriceList;
using CodePro.Application.Features.PriceLists.Queries.GetPriceList;
using CodePro.Application.Features.PriceLists.Queries.ListPriceLists;
using CodePro.Domain.Authorization;
using Platform.Api.Authorization;
using Platform.Api.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CodePro.Api.Controllers;

[ApiController]
[Route("api/price-list")]
public sealed class PriceListController : ControllerBase
{
    private readonly ISender _sender;

    public PriceListController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.PriceListPrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync([FromBody] ListPriceListsQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("get")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.PriceListPrivilegeCodes.Read)]
    public async Task<IActionResult> GetAsync([FromBody] GetPriceListQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.PriceListPrivilegeCodes.Create)]
    public async Task<IActionResult> CreateAsync([FromBody] CreatePriceListCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("update")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.PriceListPrivilegeCodes.Update)]
    public async Task<IActionResult> UpdateAsync([FromBody] UpdatePriceListCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("delete")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.PriceListPrivilegeCodes.Delete)]
    public async Task<IActionResult> DeleteAsync([FromBody] DeletePriceListCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);
}
