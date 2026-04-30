using CodePro.Application.Features.Budgets.Commands.CreateBudget;
using CodePro.Application.Features.Budgets.Commands.DeleteBudget;
using CodePro.Application.Features.Budgets.Commands.UpdateBudget;
using CodePro.Application.Features.Budgets.Queries.GetBudget;
using CodePro.Application.Features.Budgets.Queries.ListBudgets;
using CodePro.Domain.Authorization;
using Platform.Api.Authorization;
using Platform.Api.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CodePro.Api.Controllers;

[ApiController]
[Route("api/budget")]
public sealed class BudgetController : ControllerBase
{
    private readonly ISender _sender;

    public BudgetController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.BudgetPrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync([FromBody] ListBudgetsQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("get")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.BudgetPrivilegeCodes.Read)]
    public async Task<IActionResult> GetAsync([FromBody] GetBudgetQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.BudgetPrivilegeCodes.Create)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateBudgetCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("update")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.BudgetPrivilegeCodes.Update)]
    public async Task<IActionResult> UpdateAsync([FromBody] UpdateBudgetCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("delete")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.BudgetPrivilegeCodes.Delete)]
    public async Task<IActionResult> DeleteAsync([FromBody] DeleteBudgetCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);
}
