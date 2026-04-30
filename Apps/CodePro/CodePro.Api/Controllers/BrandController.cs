using CodePro.Application.Features.Brands.Commands.CreateBrand;
using CodePro.Application.Features.Brands.Commands.DeleteBrand;
using CodePro.Application.Features.Brands.Commands.UpdateBrand;
using CodePro.Application.Features.Brands.Queries.GetBrand;
using CodePro.Application.Features.Brands.Queries.ListBrands;
using CodePro.Domain.Authorization;
using Platform.Api.Authorization;
using Platform.Api.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CodePro.Api.Controllers;

[ApiController]
[Route("api/brand")]
public sealed class BrandController : ControllerBase
{
    private readonly ISender _sender;

    public BrandController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.BrandPrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync([FromBody] ListBrandsQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("get")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.BrandPrivilegeCodes.Read)]
    public async Task<IActionResult> GetAsync([FromBody] GetBrandQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.BrandPrivilegeCodes.Create)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateBrandCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("update")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.BrandPrivilegeCodes.Update)]
    public async Task<IActionResult> UpdateAsync([FromBody] UpdateBrandCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("delete")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.BrandPrivilegeCodes.Delete)]
    public async Task<IActionResult> DeleteAsync([FromBody] DeleteBrandCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);
}
