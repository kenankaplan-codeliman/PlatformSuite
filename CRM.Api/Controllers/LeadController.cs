using CRM.Api.Authorization;
using CRM.Api.Contracts.Requests.Common;
using CRM.Api.Contracts.Requests.Lead;
using CRM.Api.Contracts.Responses;
using CRM.Api.Extensions;

using CRM.Application.CommandHandler;
using CRM.Application.Exceptions;
using CRM.Application.Modals;
using CRM.Application.Modals.Common;
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
    [PrivilegeAuthorize(PrivilegeCodes.LeadPrivilegeCodes.Read)]
    public async Task<IActionResult> List(LeadListRequest request)
    {
       var response =  await leadCommandHandler.List(request.filters, new PaginationInfo(request.Page, request.PageSize));
        return Ok(response);
    }

    [HttpPost("search")]
    [ProducesResponseType(typeof(EntityReferenceList), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.LeadPrivilegeCodes.Read)]
    public async Task<IActionResult> bulkUpdateStatus(SearchRequest request)
    {
        var response = await leadCommandHandler.LookupReference(request.SearchText, new PaginationInfo(request.Page, request.PageSize));
        return Ok(response);
    }

    [HttpPost("get")]
    [ProducesResponseType(typeof(LeadDetailItem), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.LeadPrivilegeCodes.Read)]
    public async Task<IActionResult> get(LeadGetRequest leadDetail)
    {
        var lead = await leadCommandHandler.Get(leadDetail.Id);
        return Ok(lead);
    }


    [HttpPost("create")]
    [ProducesResponseType(typeof(LeadDetailItem), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.LeadPrivilegeCodes.Create)]
    public async Task<IActionResult> create(LeadDetailItem leadDetail)
    {
        var lead = await leadCommandHandler.Create(leadDetail);
        return Ok(lead);
    }

    
    [HttpPost("update")]
    [PrivilegeAuthorize(PrivilegeCodes.LeadPrivilegeCodes.Update)]
    public async Task<IActionResult> update(LeadUpdateRequest request)
    {
        var lead = await leadCommandHandler.Update(request.Id, request.Data);
        return Ok(lead);
    }

    [HttpPost("delete")]
    [PrivilegeAuthorize(PrivilegeCodes.LeadPrivilegeCodes.Delete)]
    public async Task<IActionResult> delete(LeadDeleteRequest request)
    {
        await leadCommandHandler.Delete(request.Id);
        return Ok();
    }

    [HttpPost("bulk-delete")]
    [PrivilegeAuthorize(PrivilegeCodes.LeadPrivilegeCodes.Delete)]
    public async Task<IActionResult> bulkdelete(LeadBulkDeleteRequest request)
    {
        await leadCommandHandler.BulkDelete(request.Ids);
        return Ok();
    }

    [HttpPost("bulk-update-status")]
    [PrivilegeAuthorize(PrivilegeCodes.LeadPrivilegeCodes.Delete)]
    public async Task<IActionResult> bulkUpdateStatus(LeadBulkUpdateStatusRequest request)
    {
        await leadCommandHandler.BulkUpdateStatus(request.Ids, request.Status);
        return Ok();
    }

}
