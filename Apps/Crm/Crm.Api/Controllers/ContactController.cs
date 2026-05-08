using Platform.Api.Authorization;
using Platform.Api.Extensions;
using Crm.Application.Features.Contacts.Commands.AssignContact;
using Crm.Application.Features.Contacts.Commands.BulkUpdateStatusContact;
using Crm.Application.Features.Contacts.Commands.CreateContact;
using Crm.Application.Features.Contacts.Commands.DeleteContact;
using Crm.Application.Features.Contacts.Commands.SetStateContact;
using Crm.Application.Features.Contacts.Commands.UpdateContact;
using Crm.Application.Features.Contacts.Queries.GetContact;
using Crm.Application.Features.Contacts.Queries.ListContacts;
using Crm.Application.Features.Contacts.Queries.SearchContacts;
using Platform.Domain.Authorization;
using Crm.Domain.Authorization;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Crm.Api.Controllers;

[ApiController]
[Route("api/contact")]
public sealed class ContactController : ControllerBase
{
    private readonly ISender _sender;

    public ContactController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.ContactPrivilegeCodes.Read)]
    public async Task<IActionResult> List([FromBody] ListContactsQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("search")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.ContactPrivilegeCodes.Read)]
    public async Task<IActionResult> SearchAsync([FromBody] SearchContactsQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("get")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.ContactPrivilegeCodes.Read)]
    public async Task<IActionResult> Get([FromBody] GetContactQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.ContactPrivilegeCodes.Create)]
    public async Task<IActionResult> Create([FromBody] CreateContactCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("update")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.ContactPrivilegeCodes.Update)]
    public async Task<IActionResult> Update([FromBody] UpdateContactCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("delete")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.ContactPrivilegeCodes.Delete)]
    public async Task<IActionResult> Delete([FromBody] DeleteContactCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("assign")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.ContactPrivilegeCodes.Assign)]
    public async Task<IActionResult> Assign([FromBody] AssignContactCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("set-state")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.ContactPrivilegeCodes.State)]
    public async Task<IActionResult> SetState([FromBody] SetStateContactCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("bulk-update-status")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.ContactPrivilegeCodes.Update)]
    public async Task<IActionResult> BulkUpdateStatus([FromBody] BulkUpdateStatusContactCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);
}
