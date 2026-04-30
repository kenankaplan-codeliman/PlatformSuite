using CodePro.Application.Features.Offers.Commands.CreateOffer;
using CodePro.Application.Features.Offers.Commands.DeleteOffer;
using CodePro.Application.Features.Offers.Commands.UpdateOffer;
using CodePro.Application.Features.Offers.Queries.GetOffer;
using CodePro.Application.Features.Offers.Queries.ListOffers;
using CodePro.Domain.Authorization;
using Platform.Api.Authorization;
using Platform.Api.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CodePro.Api.Controllers;

[ApiController]
[Route("api/offer")]
public sealed class OfferController : ControllerBase
{
    private readonly ISender _sender;

    public OfferController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.OfferPrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync([FromBody] ListOffersQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("get")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.OfferPrivilegeCodes.Read)]
    public async Task<IActionResult> GetAsync([FromBody] GetOfferQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.OfferPrivilegeCodes.Create)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateOfferCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("update")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.OfferPrivilegeCodes.Update)]
    public async Task<IActionResult> UpdateAsync([FromBody] UpdateOfferCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("delete")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.OfferPrivilegeCodes.Delete)]
    public async Task<IActionResult> DeleteAsync([FromBody] DeleteOfferCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);
}
