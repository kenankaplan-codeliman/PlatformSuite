using CRM.Api.Authorization;
using CRM.Api.Contracts.Requests.Common;
using CRM.Application.CommandHandler;
using CRM.Application.Interfaces;
using CRM.Application.Modals.Common;
using CRM.Application.Modals.OpportunityModal;
using CRM.Domain.Authorization;
using CRM.Domain.Entities.Identities;
using CRM.Domain.Entities.Leads;
using CRM.Domain.Entities.Opportunities;
using CRM.Domain.Entities.Products;
using CRM.Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace CRM.Api.Controllers;

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
    [PrivilegeAuthorize(
        PrivilegeCodes.ContactPrivilegeCodes.Read,
        PrivilegeCodes.AccountPrivilegeCodes.Read,
        PrivilegeCodes.ProductPrivilegeCodes.Read,
        PrivilegeCodes.LeadPrivilegeCodes.Read,
        PrivilegeCodes.OpportunityPrivilegeCodes.Read,
        PrivilegeCodes.UserPrivilegeCodes.Read
        )]
    public async Task<IActionResult> Get(AuditRequest auditRequest)
    {
        var opportunity = await auditCommandHandler.GetAsync(auditRequest.Id, auditRequest.EntityType);
        return Ok(opportunity);
    }

}
