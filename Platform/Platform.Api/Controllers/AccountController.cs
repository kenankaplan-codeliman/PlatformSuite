using Platform.Api.Authorization;
using Platform.Api.Extensions;
using Platform.Application.Features.Accounts.Commands.AssignAccount;
using Platform.Application.Features.Accounts.Commands.BulkUpdateStatusAccount;
using Platform.Application.Features.Accounts.Commands.CreateAccount;
using Platform.Application.Features.Accounts.Commands.DeleteAccount;
using Platform.Application.Features.Accounts.Commands.SetStateAccount;
using Platform.Application.Features.Accounts.Commands.UpdateAccount;
using Platform.Application.Features.Accounts.Queries.GetAccount;
using Platform.Application.Features.Accounts.Queries.ListAccounts;
using Platform.Application.Features.Accounts.Queries.SearchAccounts;
using Platform.Domain.Authorization;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Platform.Api.Controllers;

[ApiController]
[Route("api/account")]
public sealed class AccountController : ControllerBase
{
    private readonly ISender _sender;

    public AccountController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.Read)]
    public async Task<IActionResult> List([FromBody] ListAccountsQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("search")]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.Read)]
    public async Task<IActionResult> SearchAsync([FromBody] SearchAccountsQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("get")]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.Read)]
    public async Task<IActionResult> GetAsync([FromBody] GetAccountQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create")]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.Create)]
    public async Task<IActionResult> Create([FromBody] CreateAccountCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("update")]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.Update)]
    public async Task<IActionResult> Update([FromBody] UpdateAccountCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("delete")]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.Delete)]
    public async Task<IActionResult> Delete([FromBody] DeleteAccountCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("assign")]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.Assign)]
    public async Task<IActionResult> Assign([FromBody] AssignAccountCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("set-state")]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.State)]
    public async Task<IActionResult> SetStateAsync([FromBody] SetStateAccountCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("bulk-update-status")]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.Update)]
    public async Task<IActionResult> BulkUpdateStatus([FromBody] BulkUpdateStatusAccountCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);
}
