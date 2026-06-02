using Crm.Application.Features.Products.Commands.CreateProduct;
using Crm.Application.Features.Products.Commands.DeleteProduct;
using Crm.Application.Features.Products.Commands.SetStateProduct;
using Crm.Application.Features.Products.Commands.UpdateProduct;
using Crm.Application.Features.Products.Queries.GetProduct;
using Crm.Application.Features.Products.Queries.ListProducts;
using Crm.Application.Features.Products.Queries.SearchProducts;
using Crm.Domain.Authorization;
using Platform.Api.Authorization;
using Platform.Api.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Crm.Api.Controllers;

[ApiController]
[Route("api/product")]
public sealed class ProductController : ControllerBase
{
    private readonly ISender _sender;

    public ProductController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.ProductPrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync([FromBody] ListProductsQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("search")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.ProductPrivilegeCodes.Read)]
    public async Task<IActionResult> SearchAsync([FromBody] SearchProductsQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("get")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.ProductPrivilegeCodes.Read)]
    public async Task<IActionResult> GetAsync([FromBody] GetProductQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.ProductPrivilegeCodes.Create)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateProductCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("update")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.ProductPrivilegeCodes.Update)]
    public async Task<IActionResult> UpdateAsync([FromBody] UpdateProductCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("delete")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.ProductPrivilegeCodes.Delete)]
    public async Task<IActionResult> DeleteAsync([FromBody] DeleteProductCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("set-state")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.ProductPrivilegeCodes.State)]
    public async Task<IActionResult> SetStateAsync([FromBody] SetStateProductCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);
}
