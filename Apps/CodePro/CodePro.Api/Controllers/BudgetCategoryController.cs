using CodePro.Application.Features.BudgetCategories.Commands.CreateBudgetCategory;
using CodePro.Application.Features.BudgetCategories.Commands.DeleteBudgetCategory;
using CodePro.Application.Features.BudgetCategories.Commands.UpdateBudgetCategory;
using CodePro.Application.Features.BudgetCategories.Queries.GetBudgetCategory;
using CodePro.Application.Features.BudgetCategories.Queries.ListBudgetCategories;
using CodePro.Domain.Authorization;
using Platform.Api.Authorization;
using Platform.Api.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CodePro.Api.Controllers;

[ApiController]
[Route("api/budget-category")]
public sealed class BudgetCategoryController : ControllerBase
{
    private readonly ISender _sender;

    public BudgetCategoryController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.BudgetCategoryPrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync([FromBody] ListBudgetCategoriesQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("get")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.BudgetCategoryPrivilegeCodes.Read)]
    public async Task<IActionResult> GetAsync([FromBody] GetBudgetCategoryQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.BudgetCategoryPrivilegeCodes.Create)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateBudgetCategoryCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("update")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.BudgetCategoryPrivilegeCodes.Update)]
    public async Task<IActionResult> UpdateAsync([FromBody] UpdateBudgetCategoryCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("delete")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.BudgetCategoryPrivilegeCodes.Delete)]
    public async Task<IActionResult> DeleteAsync([FromBody] DeleteBudgetCategoryCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);
}
