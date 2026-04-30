using Crm.Application.Features.Leads.Commands.CreateLead;
using Crm.Application.Features.Leads.Commands.DeleteLead;
using Crm.Application.Features.Leads.Commands.UpdateLead;
using Crm.Application.Features.Leads.Queries.GetLead;
using Crm.Application.Features.Leads.Queries.ListLeads;
using Crm.Domain.Authorization;
using Platform.Api.Authorization;
using Platform.Api.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Crm.Api.Controllers;

[ApiController]
[Route("api/lead")]
public sealed class LeadController : ControllerBase
{
    private readonly ISender _sender;

    public LeadController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.LeadPrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync([FromBody] ListLeadsQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("get")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.LeadPrivilegeCodes.Read)]
    public async Task<IActionResult> GetAsync([FromBody] GetLeadQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.LeadPrivilegeCodes.Create)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateLeadCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("update")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.LeadPrivilegeCodes.Update)]
    public async Task<IActionResult> UpdateAsync([FromBody] UpdateLeadCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("delete")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.LeadPrivilegeCodes.Delete)]
    public async Task<IActionResult> DeleteAsync([FromBody] DeleteLeadCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);
}
