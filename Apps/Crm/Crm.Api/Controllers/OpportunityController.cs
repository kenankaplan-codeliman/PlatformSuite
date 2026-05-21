using Crm.Application.Features.Opportunities.Commands.AssignOpportunity;
using Crm.Application.Features.Opportunities.Commands.CreateOpportunity;
using Crm.Application.Features.Opportunities.Commands.DeleteOpportunity;
using Crm.Application.Features.Opportunities.Commands.SetStateOpportunity;
using Crm.Application.Features.Opportunities.Commands.UpdateOpportunity;
using Crm.Application.Features.Opportunities.Queries.GetOpportunity;
using Crm.Application.Features.Opportunities.Queries.ListOpportunities;
using Crm.Domain.Authorization;
using Platform.Api.Authorization;
using Platform.Api.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Crm.Api.Controllers;

[ApiController]
[Route("api/opportunity")]
public sealed class OpportunityController : ControllerBase
{
    private readonly ISender _sender;

    public OpportunityController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.OpportunityPrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync([FromBody] ListOpportunitiesQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("get")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.OpportunityPrivilegeCodes.Read)]
    public async Task<IActionResult> GetAsync([FromBody] GetOpportunityQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.OpportunityPrivilegeCodes.Create)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateOpportunityCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("update")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.OpportunityPrivilegeCodes.Update)]
    public async Task<IActionResult> UpdateAsync([FromBody] UpdateOpportunityCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("delete")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.OpportunityPrivilegeCodes.Delete)]
    public async Task<IActionResult> DeleteAsync([FromBody] DeleteOpportunityCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("assign")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.OpportunityPrivilegeCodes.Assign)]
    public async Task<IActionResult> AssignAsync([FromBody] AssignOpportunityCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("set-state")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.OpportunityPrivilegeCodes.State)]
    public async Task<IActionResult> SetStateAsync([FromBody] SetStateOpportunityCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);
}
