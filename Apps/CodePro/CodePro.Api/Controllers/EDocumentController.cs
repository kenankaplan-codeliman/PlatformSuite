using CodePro.Application.Features.EDocuments.Commands.CreateEDocument;
using CodePro.Application.Features.EDocuments.Commands.DeleteEDocument;
using CodePro.Application.Features.EDocuments.Commands.UpdateEDocument;
using CodePro.Application.Features.EDocuments.Queries.GetEDocument;
using CodePro.Application.Features.EDocuments.Queries.ListEDocuments;
using CodePro.Domain.Authorization;
using Platform.Api.Authorization;
using Platform.Api.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CodePro.Api.Controllers;

[ApiController]
[Route("api/edocument")]
public sealed class EDocumentController : ControllerBase
{
    private readonly ISender _sender;

    public EDocumentController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.EDocumentPrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync([FromBody] ListEDocumentsQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("get")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.EDocumentPrivilegeCodes.Read)]
    public async Task<IActionResult> GetAsync([FromBody] GetEDocumentQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.EDocumentPrivilegeCodes.Create)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateEDocumentCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("update")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.EDocumentPrivilegeCodes.Update)]
    public async Task<IActionResult> UpdateAsync([FromBody] UpdateEDocumentCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("delete")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.EDocumentPrivilegeCodes.Delete)]
    public async Task<IActionResult> DeleteAsync([FromBody] DeleteEDocumentCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);
}
