using Platform.Api.Extensions;
using Platform.Application.Features.References.Queries.SearchReferences;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Platform.Api.Controllers;

/// <summary>
/// Polimorfik EntityReference (id+name+entityType) lookup endpoint'leri. Activity
/// regarding/party gibi UI alanları (EntityLookupField) burada tek endpoint üzerinden
/// herhangi bir kayıtlı entity türünü arayabilir; registry-tabanlı resolver dispatch'i
/// IReferenceRepository tarafından yapılır.
/// </summary>
[ApiController]
[Route("api/reference")]
[Authorize]
public sealed class ReferenceController : ControllerBase
{
    private readonly ISender _sender;

    public ReferenceController(ISender sender) => _sender = sender;

    [HttpPost("lookup")]
    public async Task<IActionResult> LookupAsync(
        [FromBody] SearchReferencesQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);
}
