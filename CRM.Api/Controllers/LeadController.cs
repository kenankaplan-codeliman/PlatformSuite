using CRM.Api.Authorization;
using CRM.Api.Contracts.Requests;
using CRM.Api.Contracts.Responses;
using CRM.Api.Extensions;
using CRM.Application.Authentication.Interfaces;
using CRM.Application.CommandHandler;
using CRM.Application.Exceptions;
using CRM.Application.Modals;
using CRM.Application.Modals.LeadModal;
using CRM.Domain.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.Api.Controllers;

[ApiController]
[Route("api/lead")]
public class LeadController : ControllerBase
{
    private readonly LeadCommandHandler leadCommandHandler;
    private readonly ILogger<LeadController> logger;

    public LeadController(ILogger<LeadController> logger, LeadCommandHandler leadCommandHandler)
    {
        this.logger = logger;
        this.leadCommandHandler = leadCommandHandler;
    }
    
    [HttpPost("list")]
    [ProducesResponseType(typeof(LeadListResponse), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.Lead.Read)]
    public async Task<IActionResult> List(LeadListRequest request)
    {
       var response =  leadCommandHandler.List(request.filters, request.page, request.pageSize);
        return Ok(response);
    }

    /*
    [HttpPost("create")]
    [PrivilegeAuthorize(PrivilegeCodes.Lead.Create)]
    public async Task<IActionResult> create(LeadListRequest request)
    {
        return Ok($"Create. {currentUserContext.UserId}");
    }

    [HttpPost("update")]
    [PrivilegeAuthorize(PrivilegeCodes.Lead.Create)]
    public async Task<IActionResult> update(LeadListRequest request)
    {
        return Ok($"Update. {currentUserContext.UserId}");
    }
    */
}
