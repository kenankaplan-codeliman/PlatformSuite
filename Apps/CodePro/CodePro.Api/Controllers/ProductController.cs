using CodePro.Application.Features.ProductImages.Commands.DeleteProductImage;
using CodePro.Application.Features.ProductImages.Commands.ReorderProductImages;
using CodePro.Application.Features.ProductImages.Commands.SetDefaultProductImage;
using CodePro.Application.Features.ProductImages.Commands.UploadProductImage;
using CodePro.Application.Features.ProductImages.Queries.ListProductImages;
using CodePro.Application.Features.Products.Commands.CreateProduct;
using CodePro.Application.Features.Products.Commands.DeleteProduct;
using CodePro.Application.Features.Products.Commands.UpdateProduct;
using CodePro.Application.Features.Products.Queries.GetProduct;
using CodePro.Application.Features.Products.Queries.ListProducts;
using CodePro.Application.Features.Products.Queries.SearchProducts;
using CodePro.Application.Interfaces;
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
    private readonly IProductImageRepository _productImageRepository;

    public ProductController(ISender sender, IProductImageRepository productImageRepository)
    {
        _sender = sender;
        _productImageRepository = productImageRepository;
    }

    [HttpPost("list")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ProductPrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync([FromBody] ListProductsQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("search")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ProductPrivilegeCodes.Read)]
    public async Task<IActionResult> SearchAsync([FromBody] SearchProductsQuery query, CancellationToken ct)
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

    // ──────────────────────────────────────────────────────────────────
    // Product Images — ürünün görsel galerisi (yükleme/silme/sıralama).
    // Read = ProductPrivilege.Read; mutation'lar = ProductPrivilege.Update.
    // ──────────────────────────────────────────────────────────────────

    [HttpPost("image/list")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ProductPrivilegeCodes.Read)]
    public async Task<IActionResult> ImageListAsync([FromBody] ListProductImagesQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("image/upload")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ProductPrivilegeCodes.Update)]
    [RequestSizeLimit(20_000_000)]
    public async Task<IActionResult> ImageUploadAsync(
        [FromForm] IFormFile file,
        [FromForm] Guid productId,
        [FromForm] int sortOrder,
        CancellationToken ct)
    {
        if (file is null || file.Length == 0)
            return BadRequest("Dosya boş olamaz.");

        using var ms = new MemoryStream();
        await file.CopyToAsync(ms, ct);

        var command = new UploadProductImageCommand
        {
            ProductId = productId,
            FileName = file.FileName,
            ContentType = file.ContentType,
            FileSize = file.Length,
            DataBytes = ms.ToArray(),
            SortOrder = sortOrder,
        };

        return (await _sender.Send(command, ct)).ToActionResult(HttpContext);
    }

    [HttpPost("image/delete")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ProductPrivilegeCodes.Update)]
    public async Task<IActionResult> ImageDeleteAsync([FromBody] DeleteProductImageCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("image/reorder")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ProductPrivilegeCodes.Update)]
    public async Task<IActionResult> ImageReorderAsync([FromBody] ReorderProductImagesCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("image/set-default")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ProductPrivilegeCodes.Update)]
    public async Task<IActionResult> ImageSetDefaultAsync([FromBody] SetDefaultProductImageCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    /// <summary>
    /// Thumbnail / orijinal binary stream döner. Result&lt;T&gt; pattern'ından
    /// muaftır (FileResult dönmek zorunda); Attachment download endpoint'iyle aynı yaklaşım.
    /// </summary>
    [HttpPost("image/thumbnail")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ProductPrivilegeCodes.Read)]
    public async Task<IActionResult> ImageThumbnailAsync([FromBody] IdRequest request, CancellationToken ct)
    {
        var image = await _productImageRepository.GetAsync(request.Id, ct);
        if (image is null) return NotFound();
        return File(image.ThumbnailBytes, "image/jpeg", image.FileName);
    }

    [HttpPost("image/download")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ProductPrivilegeCodes.Read)]
    public async Task<IActionResult> ImageDownloadAsync([FromBody] IdRequest request, CancellationToken ct)
    {
        var image = await _productImageRepository.GetAsync(request.Id, ct);
        if (image is null) return NotFound();
        return File(image.ImageBytes, image.ContentType, image.FileName);
    }

    public sealed record IdRequest(Guid Id);
}
