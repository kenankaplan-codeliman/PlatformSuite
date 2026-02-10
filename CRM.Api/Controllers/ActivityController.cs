using CRM.Api.Authorization;
using CRM.Api.Contracts.Requests.Activity;
using CRM.Api.Contracts.Requests.Lead;
using CRM.Application.CommandHandler;
using CRM.Application.Modals.ActivityModal;
using CRM.Application.Modals.Common;
using CRM.Domain.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.Api.Controllers;

[ApiController]
[Route("api/activity")]
public class ActivityController : ControllerBase
{
    private readonly ActivityCommandHandler activityCommandHandler;
    private readonly ILogger<LeadController> logger;

    public ActivityController(ILogger<LeadController> logger, 
        ActivityCommandHandler activityCommandHandler)
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

    [HttpPost("calendar")]
    [ProducesResponseType(typeof(List<ActivityListItem>), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Read)]
    public async Task<IActionResult> Calendar(ActivityCalendarRequest request)
    {
        var response = await activityCommandHandler.Calendar(request.filters, request.StartDate, request.EndDate);
        return Ok(response);
    }


    #region Appointment

    [HttpPost("get/appointment")]
    [ProducesResponseType(typeof(AppointmentModal), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.AppointmentRead)]
    public async Task<IActionResult> AppointmentRead(ActivityRequest request)
    {
        var response = await activityCommandHandler.AppointmentRead(request.Id);
        return Ok(response);
    }

    [HttpPost("create/appointment")]
    [ProducesResponseType(typeof(AppointmentModal), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.AppointmentCreate)]
    public async Task<IActionResult> AppointmentCreate(AppointmentModal request)
    {
        var response = await activityCommandHandler.AppointmentCreate(request);
        return Ok(response);
    }

    [HttpPost("update/appointment")]
    [ProducesResponseType(typeof(AppointmentModal), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.AppointmentUpdate)]
    public async Task<IActionResult> AppointmentUpdate(AppointmentModal request)
    {
        var response = await activityCommandHandler.AppointmentUpdate(request);
        return Ok(response);
    }

    #endregion

    #region PhoneCall

    [HttpPost("get/phonecall")]
    [ProducesResponseType(typeof(PhoneCallModal), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.PhoneCallRead)]
    public async Task<IActionResult> PhoneCallRead(ActivityRequest request)
    {
        var response = await activityCommandHandler.PhoneCallRead(request.Id);
        return Ok(response);
    }

    [HttpPost("create/phonecall")]
    [ProducesResponseType(typeof(PhoneCallModal), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.PhoneCallCreate)]
    public async Task<IActionResult> PhoneCallCreate(PhoneCallModal request)
    {
        var response = await activityCommandHandler.PhoneCallCreate(request);
        return Ok(response);
    }

    [HttpPost("update/phonecall")]
    [ProducesResponseType(typeof(PhoneCallModal), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.PhoneCallUpdate)]
    public async Task<IActionResult> PhoneCallUpdate(PhoneCallModal request)
    {
        var response = await activityCommandHandler.PhoneCallUpdate(request);
        return Ok(response);
    }

    #endregion





}
