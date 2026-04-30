using CodePro.Application.Features.Products.Commands.CreateProduct;
using CodePro.Application.Features.Products.Commands.DeleteProduct;
using CodePro.Application.Features.Products.Commands.UpdateProduct;
using CodePro.Application.Features.Products.Queries.GetProduct;
using CodePro.Application.Features.Products.Queries.ListProducts;
using CodePro.Domain.Authorization;
using Platform.Api.Authorization;
using Platform.Api.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CodePro.Api.Controllers;

[ApiController]
[Route("api/product")]
public sealed class ProductController : ControllerBase
{
    private readonly ISender _sender;

    public ProductController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ProductPrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync([FromBody] ListProductsQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("get")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ProductPrivilegeCodes.Read)]
    public async Task<IActionResult> GetAsync([FromBody] GetProductQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ProductPrivilegeCodes.Create)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateProductCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("update")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ProductPrivilegeCodes.Update)]
    public async Task<IActionResult> UpdateAsync([FromBody] UpdateProductCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("delete")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ProductPrivilegeCodes.Delete)]
    public async Task<IActionResult> DeleteAsync([FromBody] DeleteProductCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);
}
