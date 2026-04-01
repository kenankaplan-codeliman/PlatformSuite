using CRM.Api.Authorization;
using CRM.Api.Contracts.Requests.Account;
using CRM.Api.Contracts.Requests.Common;
using CRM.Application.CommandHandler;
using CRM.Application.Modals.AccountModal;
using CRM.Application.Modals.Common;
using CRM.Domain.Authorization;
using Microsoft.AspNetCore.Mvc;
using CRM.Domain.Enums;

namespace CRM.Api.Controllers;

[ApiController]
[Route("api/account")]
public class AccountController : ControllerBase 
{
    private readonly AccountCommandHandler accountCommandHandler;   

    public AccountController(AccountCommandHandler accountCommandHandler)
    {
        this.accountCommandHandler = accountCommandHandler;
    }

    [HttpPost("list")]
    [ProducesResponseType(typeof(AccountListResponse), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.Read)]
    public async Task<IActionResult> List(AccountListRequest request)
    {
        var response = await accountCommandHandler.ListAsync(request.Filters, new PaginationInfo(request.Page, request.PageSize));
        return Ok(response);
    }

    [HttpPost("search")]
    [ProducesResponseType(typeof(EntityReferenceList), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.Read)]
    public async Task<IActionResult> SearchAsync(SearchRequest request)
    {
        var response = await accountCommandHandler.SearchAsync(request.SearchText, new PaginationInfo(request.Page, request.PageSize));
        return Ok(response);
    }

    [HttpPost("get")]
    [ProducesResponseType(typeof(AccountDetailItem), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.Read)]
    public async Task<IActionResult> GetAsync(IdRequest idRequest)
    {
        var account = await accountCommandHandler.GetAsync(idRequest.Id);
        return Ok(account);
    }


    [HttpPost("create")]
    [ProducesResponseType(typeof(AccountDetailItem), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.Create)]
    public async Task<IActionResult> Create(AccountDetailItem accDetail)
    {
        var account = await accountCommandHandler.CreateAsync(accDetail);
        return Ok(account);
    }


    [HttpPost("update")]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.Update)]
    public async Task<IActionResult> Update(AccountDetailItem accDetail)
    {
        var lead = await accountCommandHandler.UpdateAsync(accDetail);
        return Ok(lead);
    }

    [HttpPost("delete")]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.Delete)]
    public async Task<IActionResult> Delete(IdListRequest idListRequest)
    {
        await accountCommandHandler.DeleteAsync(idListRequest.Ids);
        return Ok();
    }

    [HttpPost("assign")]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.Assign)]
    public async Task<IActionResult> Assign(AssignRequest request)
    {
        await accountCommandHandler.AssignAsync(request.Ids, request.OwnerId);
        return Ok();
    }

    [HttpPost("set-state")]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.State)]
    public async Task<IActionResult> SetStateAsync(StatusRequest request)
    {
        await accountCommandHandler.SetStateAsync(request.Ids, request.IsActive);
        return Ok();
    }

    [HttpPost("bulk-update-status")]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.Update)]
    public async Task<IActionResult> BulkUpdateStatus(AccountBulkUpdateStatusRequest request)
    {
        await accountCommandHandler.BulkUpdateStatusAsync(request.Ids, request.Status);
        return Ok();
    }

}
