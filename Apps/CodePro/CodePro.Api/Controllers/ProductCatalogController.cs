using CodePro.Application.Features.ProductCatalogs.Commands.CreateProductCatalog;
using CodePro.Application.Features.ProductCatalogs.Commands.DeleteProductCatalog;
using CodePro.Application.Features.ProductCatalogs.Commands.UpdateProductCatalog;
using CodePro.Application.Features.ProductCatalogs.Queries.GetProductCatalog;
using CodePro.Application.Features.ProductCatalogs.Queries.ListProductCatalogs;
using CodePro.Domain.Authorization;
using Platform.Api.Authorization;
using Platform.Api.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CodePro.Api.Controllers;

[ApiController]
[Route("api/product-catalog")]
public sealed class ProductCatalogController : ControllerBase
{
    private readonly ISender _sender;

    public ProductCatalogController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ProductCatalogPrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync([FromBody] ListProductCatalogsQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("get")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ProductCatalogPrivilegeCodes.Read)]
    public async Task<IActionResult> GetAsync([FromBody] GetProductCatalogQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ProductCatalogPrivilegeCodes.Create)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateProductCatalogCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("update")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ProductCatalogPrivilegeCodes.Update)]
    public async Task<IActionResult> UpdateAsync([FromBody] UpdateProductCatalogCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("delete")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ProductCatalogPrivilegeCodes.Delete)]
    public async Task<IActionResult> DeleteAsync([FromBody] DeleteProductCatalogCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);
}
