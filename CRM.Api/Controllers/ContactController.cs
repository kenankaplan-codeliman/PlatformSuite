using CRM.Api.Authorization;
using CRM.Api.Contracts.Requests.Common;
using CRM.Api.Contracts.Requests.Contact;
using CRM.Application.CommandHandler;
using CRM.Application.Modals.AccountModal;
using CRM.Application.Modals.Common;
using CRM.Application.Modals.ContactModal;
using CRM.Application.Modals.LeadModal;
using CRM.Domain.Authorization;
using CRM.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace CRM.Api.Controllers;

[ApiController]
[Route("api/contact")]
public class ContactController : ControllerBase 
{
    private readonly ContactCommandHandler contactCommandHandler;   

    public ContactController(ContactCommandHandler accountCommandHandler)
    {
        this.contactCommandHandler = accountCommandHandler;
    }

    [HttpPost("list")]
    [ProducesResponseType(typeof(AccountListResponse), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ContactPrivilegeCodes.Read)]
    public async Task<IActionResult> List(ContactListRequest request)
    {
        var response = await contactCommandHandler.ListAsync(request.Filters, new PaginationInfo(request.Page, request.PageSize));
        return Ok(response);
    }

    [HttpPost("search")]
    [ProducesResponseType(typeof(EntityReferenceList), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ContactPrivilegeCodes.Read)]
    public async Task<IActionResult> SearchAsync(SearchRequest request)
    {
        var response = await contactCommandHandler.SearchAsync(request.SearchText, new PaginationInfo(request.Page, request.PageSize));
        return Ok(response);
    }

    [HttpPost("get")]
    [ProducesResponseType(typeof(ContactDetailItem), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ContactPrivilegeCodes.Read)]
    public async Task<IActionResult> Get(IdRequest idRequest)
    {
        var contact = await contactCommandHandler.GetAsync(idRequest.Id);
        return Ok(contact);
    }


    [HttpPost("create")]
    [ProducesResponseType(typeof(ContactDetailItem), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ContactPrivilegeCodes.Create)]
    public async Task<IActionResult> Create(ContactDetailItem contactDetail)
    {
        var contact = await contactCommandHandler.CreateAsync(contactDetail);
        return Ok(contact);
    }


    [HttpPost("update")]
    [ProducesResponseType(typeof(ContactDetailItem), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ContactPrivilegeCodes.Update)]
    public async Task<IActionResult> Update(ContactDetailItem contactDetail)
    {
        var contact = await contactCommandHandler.UpdateAsync(contactDetail);
        return Ok(contact);
    }

    [HttpPost("delete")]
    [PrivilegeAuthorize(PrivilegeCodes.ContactPrivilegeCodes.Delete)]
    public async Task<IActionResult> Delete(IdListRequest idListRequest)
    {
        await contactCommandHandler.DeleteAsync(idListRequest.Ids);
        return Ok();
    }

    [HttpPost("assign")]
    [PrivilegeAuthorize(PrivilegeCodes.ContactPrivilegeCodes.Assign)]
    public async Task<IActionResult> Assign(AssignRequest request)
    {
        await contactCommandHandler.AssignAsync(request.Ids, request.OwnerId);
        return Ok();
    }

    [HttpPost("set-state")]
    [PrivilegeAuthorize(PrivilegeCodes.ContactPrivilegeCodes.State)]
    public async Task<IActionResult> SetState(StatusRequest request)
    {
        await contactCommandHandler.SetStateAsync(request.Ids, request.IsActive);
        return Ok();
    }

    [HttpPost("bulk-update-status")]
    [PrivilegeAuthorize(PrivilegeCodes.ContactPrivilegeCodes.Update)]
    public async Task<IActionResult> BulkUpdateStatus(ContactBulkUpdateStatusRequest request)
    {
        await contactCommandHandler.BulkUpdateStatusAsync(request.Ids, request.Status);
        return Ok();
    }



}
