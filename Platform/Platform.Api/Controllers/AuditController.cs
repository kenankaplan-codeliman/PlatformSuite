using Platform.Api.Authorization;
using Platform.Api.Contracts.Requests.Common;
using Platform.Application.CommandHandler;
using Platform.Application.Interfaces;
using Platform.Application.Modals.Common;
using Platform.Domain.Authorization;
using Platform.Domain.Entities.Identities;
using Microsoft.AspNetCore.Mvc;

namespace Platform.Api.Controllers;

[ApiController]
[Route("api/audit")]
public class AuditController : ControllerBase
{
    private readonly AuditCommandHandler auditCommandHandler;

    public AuditController(AuditCommandHandler auditCommandHandler)
    {
        this.auditCommandHandler = auditCommandHandler;
    }

    [HttpPost("get")]
    [ProducesResponseType(typeof(AuditInfo), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.UserPrivilegeCodes.Read)]
    public async Task<IActionResult> Get(AuditRequest auditRequest)
    {
        var audit = await auditCommandHandler.GetAsync(auditRequest.Id, auditRequest.EntityType);
        return Ok(audit);
    }
}
