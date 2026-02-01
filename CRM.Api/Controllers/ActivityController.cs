using CRM.Api.Authorization;
using CRM.Api.Contracts.Requests.Lead;
using CRM.Application.CommandHandler;
using CRM.Application.Modals.Common;
using CRM.Application.Modals.ActivityModal;
using CRM.Domain.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.Api.Controllers;

[ApiController]
[Route("api/activity")]
public class ActivityController : ControllerBase
{
    private readonly ActivityCommandHandler activityCommandHandler;
    private readonly ILogger<LeadController> logger;

    public ActivityController(ILogger<LeadController> logger, ActivityCommandHandler activityCommandHandler)
    {
        this.logger = logger;
        this.activityCommandHandler = activityCommandHandler;
    }

    [HttpPost("list")]
    [ProducesResponseType(typeof(ActivityListResponse), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Read)]
    public async Task<IActionResult> List(ActivityListRequest request)
    {
        var response = await activityCommandHandler.List(request.filters, new PaginationInfo(request.page, request.pageSize));
        return Ok(response);
    }
}
