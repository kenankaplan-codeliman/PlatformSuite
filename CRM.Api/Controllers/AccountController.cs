using CRM.Api.Authorization;
using CRM.Api.Contracts.Requests.Account;
using CRM.Api.Contracts.Requests.Common;
using CRM.Application.CommandHandler;
using CRM.Application.Modals.AccountModal;
using CRM.Application.Modals.Common;
using CRM.Domain.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        var response = await accountCommandHandler.List(request.Filters, new PaginationInfo(request.Page, request.PageSize));
        return Ok(response);
    }

    [HttpPost("search")]
    [ProducesResponseType(typeof(EntityReferenceList), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.Read)]
    public async Task<IActionResult> BulkUpdateStatus(SearchRequest request)
    {
        var response = await accountCommandHandler.LookupReference(request.SearchText, new PaginationInfo(request.Page, request.PageSize));
        return Ok(response);
    }

    [HttpPost("get")]
    [ProducesResponseType(typeof(AccountDetailItem), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.Read)]
    public async Task<IActionResult> Get(IdRequest idRequest)
    {
        var account = await accountCommandHandler.Get(idRequest.Id);
        return Ok(account);
    }


    [HttpPost("create")]
    [ProducesResponseType(typeof(AccountDetailItem), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.Create)]
    public async Task<IActionResult> Create(AccountDetailItem accDetail)
    {
        var account = await accountCommandHandler.Create(accDetail);
        return Ok(account);
    }


    [HttpPost("update")]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.Update)]
    public async Task<IActionResult> Update(AccountDetailItem accDetail)
    {
        var lead = await accountCommandHandler.Update(accDetail);
        return Ok(lead);
    }

    [HttpPost("delete")]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.Delete)]
    public async Task<IActionResult> Delete(IdRequest idRequest)
    {
        await accountCommandHandler.Delete(idRequest.Id);
        return Ok();
    }

    [HttpPost("bulk-delete")]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.Delete)]
    public async Task<IActionResult> BulkDelete(IdListRequest idListRequest)
    {
        await accountCommandHandler.BulkDelete(idListRequest.Ids);
        return Ok();
    }



}
