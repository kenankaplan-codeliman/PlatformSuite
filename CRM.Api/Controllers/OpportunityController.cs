using CRM.Api.Authorization;
using CRM.Api.Contracts.Requests.Common;
using CRM.Application.CommandHandler;
using CRM.Application.Modals.Common;
using CRM.Application.Modals.ContactModal;
using CRM.Application.Modals.OpportunityModal;
using CRM.Domain.Authorization;
using Microsoft.AspNetCore.Mvc;



namespace CRM.Api.Controllers;

[ApiController]
[Route("api/opportunity")]
public class OpportunityController : ControllerBase
{
    private readonly OpportunityCommandHandler opportunityCommandHandler;

    public OpportunityController(OpportunityCommandHandler opportunityCommandHandler)
    {
        this.opportunityCommandHandler = opportunityCommandHandler;
    }

    [HttpPost("list")]
    [ProducesResponseType(typeof(OpportunityListResponse), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.OpportunityPrivilegeCodes.Read)]
    public async Task<IActionResult> List(OpportunityListRequest request)
    {
        var response = await opportunityCommandHandler.List(request.Filters, new PaginationInfo(request.Page, request.PageSize));
        return Ok(response);
    }

    [HttpPost("search")]
    [ProducesResponseType(typeof(EntityReferenceList), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.OpportunityPrivilegeCodes.Read)]
    public async Task<IActionResult> BulkUpdateStatus(SearchRequest request)
    {
        var response = await opportunityCommandHandler.LookupReference(request.SearchText, new PaginationInfo(request.Page, request.PageSize));
        return Ok(response);
    }

    [HttpPost("get")]
    [ProducesResponseType(typeof(OpportunityDetailItem), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.OpportunityPrivilegeCodes.Read)]
    public async Task<IActionResult> Get(IdRequest idRequest)
    {
        var opportunity = await opportunityCommandHandler.Get(idRequest.Id);
        return Ok(opportunity);
    }


    [HttpPost("create")]
    [ProducesResponseType(typeof(OpportunityDetailItem), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.OpportunityPrivilegeCodes.Create)]
    public async Task<IActionResult> Create(OpportunityDetailItem contactDetail)
    {
        var opportunity = await opportunityCommandHandler.Create(contactDetail);
        return Ok(opportunity);
    }


    [HttpPost("update")]
    [ProducesResponseType(typeof(OpportunityDetailItem), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.OpportunityPrivilegeCodes.Update)]
    public async Task<IActionResult> Update(OpportunityDetailItem contactDetail)
    {
        var opportunity = await opportunityCommandHandler.Update(contactDetail);
        return Ok(opportunity);
    }

    [HttpPost("delete")]
    [PrivilegeAuthorize(PrivilegeCodes.OpportunityPrivilegeCodes.Delete)]
    public async Task<IActionResult> Delete(IdListRequest idListRequest)
    {
        await opportunityCommandHandler.Delete(idListRequest.Ids);
        return Ok();
    }

    [HttpPost("assign")]
    [PrivilegeAuthorize(PrivilegeCodes.OpportunityPrivilegeCodes.Assign)]
    public async Task<IActionResult> AssignAsync(AssignRequest request)
    {
        await opportunityCommandHandler.AssignAsync(request.Ids, request.OwnerId);
        return Ok();
    }

    [HttpPost("set-state")]
    [PrivilegeAuthorize(PrivilegeCodes.OpportunityPrivilegeCodes.State)]
    public async Task<IActionResult> SetStateAsync(StatusRequest request)
    {
        await opportunityCommandHandler.SetStateAsync(request.Ids, request.IsActive);
        return Ok();
    }
}
