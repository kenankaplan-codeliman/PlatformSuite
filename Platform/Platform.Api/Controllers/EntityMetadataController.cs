using Platform.Api.Extensions;
using Platform.Application.Features.EntityMetadata.Queries.GetEntityMetadata;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Platform.Api.Controllers;

/// <summary>
/// Tipten bağımsız ortak entity metadata'sı (audit / owner / state) endpoint'i.
/// Her Detail sayfasının footer'ı buradan tek bir çağrıyla beslenir; entity tipine
/// göre app Infrastructure'ındaki IEntityMetadataResolver'a dispatch edilir.
/// Salt-okunur audit bilgisi olduğu için sadece authenticated korumalı.
/// </summary>
[ApiController]
[Route("api/entity-metadata")]
[Authorize]
public sealed class EntityMetadataController : ControllerBase
{
    private readonly ISender _sender;

    public EntityMetadataController(ISender sender) => _sender = sender;

    [HttpPost("get")]
    public async Task<IActionResult> GetAsync([FromBody] GetEntityMetadataQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);
}
