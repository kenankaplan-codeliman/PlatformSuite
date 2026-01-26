using CRM.Api.Authorization;
using CRM.Api.Contracts.Requests;
using CRM.Api.Extensions;
using CRM.Application.Authentication.Interfaces;
using CRM.Application.Exceptions;
using CRM.Domain.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.Api.Controllers;

[ApiController]
[Route("api/lead")]
public class LeadController : ControllerBase
{
    private readonly ICurrentUserContext currentUserContext;
    private readonly ILogger<LeadController> logger;

    public LeadController(ILogger<LeadController> logger, ICurrentUserContext currentUserContext)
    {
        this.logger = logger;
        this.currentUserContext = currentUserContext;
    }
    
    [HttpPost("list")]
    [PrivilegeAuthorize(PrivilegeCodes.Lead.Read)]
    public async Task<IActionResult> List(CustomerListRequest request)
    {
        return Ok($"List. {currentUserContext.UserId}");
    }


    [HttpPost("create")]
    [PrivilegeAuthorize(PrivilegeCodes.Lead.Create)]
    public async Task<IActionResult> create(CustomerListRequest request)
    {
        return Ok($"Create. {currentUserContext.UserId}");
    }

    [HttpPost("update")]
    [PrivilegeAuthorize(PrivilegeCodes.Lead.Create)]
    public async Task<IActionResult> update(CustomerListRequest request)
    {
        return Ok($"Update. {currentUserContext.UserId}");
    }


    [HttpGet("test")]
    public async Task<IActionResult> test()
    {
        return Ok($"Ok");
    }
}
