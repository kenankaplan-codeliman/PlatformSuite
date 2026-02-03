using CRM.Api.Authorization;
using CRM.Api.Contracts.Requests.Common;
using CRM.Application.CommandHandler;
using CRM.Application.Modals.Common;
using CRM.Domain.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.Api.Controllers;

[ApiController]
[Route("api/user")]
public class UserController : ControllerBase
{
    private readonly UserCommandHandler userCommandHandler;
    private readonly ILogger<LeadController> logger;

    public UserController(ILogger<LeadController> logger, UserCommandHandler userCommandHandler)
    {
        this.logger = logger;
        this.userCommandHandler = userCommandHandler;
    }

    [HttpPost("search")]
    [ProducesResponseType(typeof(SearchListResponse), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.UserPrivilegeCodes.Read)]
    public async Task<IActionResult> bulkUpdateStatus(SearchRequest request)
    {
        var response = await userCommandHandler.Search(request.SearchText, new PaginationInfo(request.Page, request.PageSize));
        return Ok(response);
    }
}

