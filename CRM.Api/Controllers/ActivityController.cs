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

    [HttpPost("calendar")]
    [ProducesResponseType(typeof(List<ActivityBaseModal>), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Read)]
    public async Task<IActionResult> Calendar(ActivityCalendarRequest request)
    {
        var response = await activityCommandHandler.Calendar(request.filters, request.StartDate, request.EndDate);
        return Ok(response);
    }


    # region Appointment

    [HttpPost("/create/appointment")]
    [ProducesResponseType(typeof(AppointmentActivityModal), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.AppointmentCreate)]
    public async Task<IActionResult> AppointmentCreate(AppointmentActivityModal request)
    {
        var response = await activityCommandHandler.CreateAppointment(request);
        return Ok(response);
    }

    [HttpPost("/get/appointment")]
    [ProducesResponseType(typeof(AppointmentActivityModal), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.AppointmentRead)]
    public async Task<IActionResult> AppointmentRead(ActivityGetRequest request)
    {
        var response = await activityCommandHandler.ReadAppointment(request.Id);
        return Ok(response);
    }

    #endregion





}
