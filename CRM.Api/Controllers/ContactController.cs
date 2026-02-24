using CRM.Api.Authorization;
using CRM.Api.Contracts.Requests.Common;
using CRM.Api.Contracts.Requests.Contact;
using CRM.Application.CommandHandler;
using CRM.Application.Modals.AccountModal;
using CRM.Application.Modals.Common;
using CRM.Application.Modals.ContactModal;
using CRM.Application.Modals.LeadModal;
using CRM.Domain.Authorization;
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
        var response = await contactCommandHandler.List(request.Filters, new PaginationInfo(request.Page, request.PageSize));
        return Ok(response);
    }

    [HttpPost("search")]
    [ProducesResponseType(typeof(EntityReferenceList), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ContactPrivilegeCodes.Read)]
    public async Task<IActionResult> BulkUpdateStatus(SearchRequest request)
    {
        var response = await contactCommandHandler.LookupReference(request.SearchText, new PaginationInfo(request.Page, request.PageSize));
        return Ok(response);
    }

    [HttpPost("get")]
    [ProducesResponseType(typeof(ContactDetailItem), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ContactPrivilegeCodes.Read)]
    public async Task<IActionResult> Get(IdRequest idRequest)
    {
        var contact = await contactCommandHandler.Get(idRequest.Id);
        return Ok(contact);
    }


    [HttpPost("create")]
    [ProducesResponseType(typeof(ContactDetailItem), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ContactPrivilegeCodes.Create)]
    public async Task<IActionResult> Create(ContactDetailItem contactDetail)
    {
        var contact = await contactCommandHandler.Create(contactDetail);
        return Ok(contact);
    }


    [HttpPost("update")]
    [ProducesResponseType(typeof(ContactDetailItem), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ContactPrivilegeCodes.Update)]
    public async Task<IActionResult> Update(ContactDetailItem contactDetail)
    {
        var contact = await contactCommandHandler.Update(contactDetail);
        return Ok(contact);
    }

    [HttpPost("delete")]
    [PrivilegeAuthorize(PrivilegeCodes.ContactPrivilegeCodes.Delete)]
    public async Task<IActionResult> Delete(IdRequest idRequest)
    {
        await contactCommandHandler.Delete(idRequest.Id);
        return Ok();
    }

    [HttpPost("bulk-delete")]
    [PrivilegeAuthorize(PrivilegeCodes.ContactPrivilegeCodes.Delete)]
    public async Task<IActionResult> BulkDelete(IdListRequest idListRequest)
    {
        await contactCommandHandler.BulkDelete(idListRequest.Ids);
        return Ok();
    }



}
