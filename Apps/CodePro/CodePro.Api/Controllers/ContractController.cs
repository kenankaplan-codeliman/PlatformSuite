using CodePro.Application.Features.Contracts.Commands.CreateContract;
using CodePro.Application.Features.Contracts.Commands.DeleteContract;
using CodePro.Application.Features.Contracts.Commands.UpdateContract;
using CodePro.Application.Features.Contracts.Queries.GetContract;
using CodePro.Application.Features.Contracts.Queries.ListContracts;
using CodePro.Domain.Authorization;
using Platform.Api.Authorization;
using Platform.Api.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CodePro.Api.Controllers;

[ApiController]
[Route("api/contract")]
public sealed class ContractController : ControllerBase
{
    private readonly ISender _sender;

    public ContractController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ContractPrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync([FromBody] ListContractsQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("get")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ContractPrivilegeCodes.Read)]
    public async Task<IActionResult> GetAsync([FromBody] GetContractQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ContractPrivilegeCodes.Create)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateContractCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("update")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ContractPrivilegeCodes.Update)]
    public async Task<IActionResult> UpdateAsync([FromBody] UpdateContractCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("delete")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.ContractPrivilegeCodes.Delete)]
    public async Task<IActionResult> DeleteAsync([FromBody] DeleteContractCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);
}
