using Platform.Api.Authorization;
using Platform.Api.Extensions;
using Platform.Application.Features.GeneralParameters.Queries.ListGeneralParameters;
using Platform.Domain.Authorization;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Platform.Api.Controllers;

[ApiController]
[Route("api/general-parameter")]
public sealed class GeneralParameterController : ControllerBase
{
    private readonly ISender _sender;

    public GeneralParameterController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(PrivilegeCodes.GeneralParameterPrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync([FromBody] ListGeneralParametersQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);
}
