using CodePro.Application.Features.ProductPrices.Commands.CreateProductPrice;
using CodePro.Application.Features.ProductPrices.Commands.DeleteProductPrice;
using CodePro.Application.Features.ProductPrices.Commands.UpdateProductPrice;
using CodePro.Application.Features.ProductPrices.Queries.GetProductPrice;
using CodePro.Application.Features.ProductPrices.Queries.ListProductPrices;
using CodePro.Domain.Authorization;
using Platform.Api.Authorization;
using Platform.Api.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CodePro.Api.Controllers;

[ApiController]
[Route("api/product-price")]
public sealed class ProductPriceController : ControllerBase
{
    private readonly ISender _sender;

    public ProductPriceController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ProductPricePrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync([FromBody] ListProductPricesQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("get")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ProductPricePrivilegeCodes.Read)]
    public async Task<IActionResult> GetAsync([FromBody] GetProductPriceQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ProductPricePrivilegeCodes.Create)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateProductPriceCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("update")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ProductPricePrivilegeCodes.Update)]
    public async Task<IActionResult> UpdateAsync([FromBody] UpdateProductPriceCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("delete")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ProductPricePrivilegeCodes.Delete)]
    public async Task<IActionResult> DeleteAsync([FromBody] DeleteProductPriceCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);
}
