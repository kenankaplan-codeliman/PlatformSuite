using Platform.Api.Authorization;
using Platform.Api.Extensions;
using Platform.Application.Features.Attachments.Commands.DeleteAttachment;
using Platform.Application.Features.Attachments.Commands.UploadAttachmentDraft;
using Platform.Application.Features.Attachments.Queries.ListAttachmentsByEntity;
using Platform.Application.Interfaces;
using Platform.Domain.Authorization;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Platform.Api.Controllers;

[ApiController]
[Route("api/attachment")]
public sealed class AttachmentController : ControllerBase
{
    private readonly ISender _sender;
    private readonly IAttachmentRepository _attachmentRepository;

    public AttachmentController(ISender sender, IAttachmentRepository attachmentRepository)
    {
        _sender = sender;
        _attachmentRepository = attachmentRepository;
    }

    /// <summary>Bir entity'e ait ek dosya meta verilerini listeler (binary içermez).</summary>
    [HttpPost("list")]
    [PrivilegeAuthorize(PrivilegeCodes.AttachmentPrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync([FromBody] ListAttachmentsByEntityQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    /// <summary>
    /// Dosyayı draft olarak yükler — henüz hiçbir entity ile ilişkilendirilmez.
    /// Dönüş metadataId frontend'in parent CreateXCommand içinde Attachments
    /// listesine ekleyeceği referanstır. İlişkilendirilmediği sürece 24 saat
    /// sonra AttachmentCleanupService tarafından silinir.
    /// </summary>
    [HttpPost("upload-draft")]
    [PrivilegeAuthorize(PrivilegeCodes.AttachmentPrivilegeCodes.Create)]
    public async Task<IActionResult> UploadDraftAsync(
        [FromForm] IFormFile file,
        [FromForm] string documentType,
        [FromForm] string? subject,
        [FromForm] string? description,
        CancellationToken ct)
    {
        if (file is null || file.Length == 0)
            return BadRequest("Dosya boş olamaz.");

        using var ms = new MemoryStream();
        await file.CopyToAsync(ms, ct);

        var command = new UploadAttachmentDraftCommand
        {
            FileName = file.FileName,
            ContentType = file.ContentType,
            FileSize = file.Length,
            DataBytes = ms.ToArray(),
            DocumentType = documentType,
            Subject = subject,
            Description = description,
        };

        return (await _sender.Send(command, ct)).ToActionResult(HttpContext);
    }

    /// <summary>Dosyanın binary verisini döner (FileResult).</summary>
    [HttpGet("download/{id:guid}")]
    [PrivilegeAuthorize(PrivilegeCodes.AttachmentPrivilegeCodes.Read)]
    public async Task<IActionResult> DownloadAsync(Guid id, CancellationToken ct)
    {
        var metadata = await _attachmentRepository.GetMetadataAsync(id, ct);
        if (metadata is null) return NotFound();

        var fileData = await _attachmentRepository.GetFileDataAsync(id, ct);
        if (fileData is null) return NotFound();

        return File(fileData.DataBytes, metadata.ContentType, metadata.FileName);
    }

    /// <summary>Ek dosyayı siler (cascade ile binary ve relation).</summary>
    [HttpPost("delete")]
    [PrivilegeAuthorize(PrivilegeCodes.AttachmentPrivilegeCodes.Delete)]
    public async Task<IActionResult> DeleteAsync([FromBody] DeleteAttachmentCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);
}
