using Platform.Api.Authorization;
using Platform.Api.Extensions;
using Crm.Application.Features.Accounts.Commands.AssignAccount;
using Crm.Application.Features.Accounts.Commands.BulkUpdateStatusAccount;
using Crm.Application.Features.Accounts.Commands.CreateAccount;
using Crm.Application.Features.Accounts.Commands.DeleteAccount;
using Crm.Application.Features.Accounts.Commands.SetStateAccount;
using Crm.Application.Features.Accounts.Commands.UpdateAccount;
using Crm.Application.Features.Accounts.Queries.GetAccount;
using Crm.Application.Features.Accounts.Queries.ListAccounts;
using Crm.Application.Features.Accounts.Queries.SearchAccounts;
using Platform.Domain.Authorization;
using Crm.Domain.Authorization;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Crm.Api.Controllers;

[ApiController]
[Route("api/account")]
public sealed class AccountController : ControllerBase
{
    private readonly ISender _sender;

    public AccountController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.AccountPrivilegeCodes.Read)]
    public async Task<IActionResult> List([FromBody] ListAccountsQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("search")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.AccountPrivilegeCodes.Read)]
    public async Task<IActionResult> SearchAsync([FromBody] SearchAccountsQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("get")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.AccountPrivilegeCodes.Read)]
    public async Task<IActionResult> GetAsync([FromBody] GetAccountQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.AccountPrivilegeCodes.Create)]
    public async Task<IActionResult> Create([FromBody] CreateAccountCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("update")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.AccountPrivilegeCodes.Update)]
    public async Task<IActionResult> Update([FromBody] UpdateAccountCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("delete")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.AccountPrivilegeCodes.Delete)]
    public async Task<IActionResult> Delete([FromBody] DeleteAccountCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("assign")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.AccountPrivilegeCodes.Assign)]
    public async Task<IActionResult> Assign([FromBody] AssignAccountCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("set-state")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.AccountPrivilegeCodes.State)]
    public async Task<IActionResult> SetStateAsync([FromBody] SetStateAccountCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("bulk-update-status")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.AccountPrivilegeCodes.Update)]
    public async Task<IActionResult> BulkUpdateStatus([FromBody] BulkUpdateStatusAccountCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);
}
