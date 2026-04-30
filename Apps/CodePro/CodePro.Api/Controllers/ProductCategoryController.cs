using CodePro.Application.Features.ProductCategories.Commands.CreateProductCategory;
using CodePro.Application.Features.ProductCategories.Commands.DeleteProductCategory;
using CodePro.Application.Features.ProductCategories.Commands.UpdateProductCategory;
using CodePro.Application.Features.ProductCategories.Queries.GetProductCategory;
using CodePro.Application.Features.ProductCategories.Queries.ListProductCategories;
using CodePro.Domain.Authorization;
using Platform.Api.Authorization;
using Platform.Api.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CodePro.Api.Controllers;

[ApiController]
[Route("api/product-category")]
public sealed class ProductCategoryController : ControllerBase
{
    private readonly ISender _sender;

    public ProductCategoryController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ProductCategoryPrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync([FromBody] ListProductCategoriesQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("get")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ProductCategoryPrivilegeCodes.Read)]
    public async Task<IActionResult> GetAsync([FromBody] GetProductCategoryQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ProductCategoryPrivilegeCodes.Create)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateProductCategoryCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("update")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ProductCategoryPrivilegeCodes.Update)]
    public async Task<IActionResult> UpdateAsync([FromBody] UpdateProductCategoryCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("delete")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ProductCategoryPrivilegeCodes.Delete)]
    public async Task<IActionResult> DeleteAsync([FromBody] DeleteProductCategoryCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);
}
