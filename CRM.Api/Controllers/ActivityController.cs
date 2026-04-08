using CRM.Api.Authorization;
using CRM.Api.Contracts.Requests.Activity;
using CRM.Api.Contracts.Requests.Common;
using CRM.Api.Contracts.Requests.Lead;
using CRM.Application.CommandHandler;
using CRM.Application.Modals.ActivityModal;
using CRM.Application.Modals.Common;
using CRM.Domain.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph.Models;
using System.Numerics;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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
        var response = await activityCommandHandler.List(request.Filters, new PaginationInfo(request.Page, request.PageSize));
        return Ok(response);
    }

    [HttpPost("calendar")]
    [ProducesResponseType(typeof(List<ActivityListItem>), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Read)]
    public async Task<IActionResult> Calendar(ActivityCalendarRequest request)
    {
        var response = await activityCommandHandler.Calendar(request.filters ?? new ActivityListFilters(), request.StartDate, request.EndDate);
        return Ok(response);
    }


    #region Appointment

    [HttpPost("get/appointment")]
    [ProducesResponseType(typeof(AppointmentModal), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Read)]
    public async Task<IActionResult> AppointmentRead(ActivityRequest request)
    {
        var response = await activityCommandHandler.AppointmentRead(request.Id);
        return Ok(response);
    }

    [HttpPost("create/appointment")]
    [ProducesResponseType(typeof(AppointmentModal), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Create)]
    public async Task<IActionResult> AppointmentCreate(AppointmentModal request)
    {
        var response = await activityCommandHandler.AppointmentCreate(request);
        return Ok(response);
    }

    [HttpPost("update/appointment")]
    [ProducesResponseType(typeof(AppointmentModal), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Update)]
    public async Task<IActionResult> AppointmentUpdate(AppointmentModal request)
    {
        var response = await activityCommandHandler.AppointmentUpdate(request);
        return Ok(response);
    }

    #endregion

    #region PhoneCall

    [HttpPost("get/phonecall")]
    [ProducesResponseType(typeof(PhoneCallModal), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Read)]
    public async Task<IActionResult> PhoneCallRead(ActivityRequest request)
    {
        var response = await activityCommandHandler.PhoneCallRead(request.Id);
        return Ok(response);
    }

    [HttpPost("create/phonecall")]
    [ProducesResponseType(typeof(PhoneCallModal), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Create)]
    public async Task<IActionResult> PhoneCallCreate(PhoneCallModal request)
    {
        var response = await activityCommandHandler.PhoneCallCreate(request);
        return Ok(response);
    }

    [HttpPost("update/phonecall")]
    [ProducesResponseType(typeof(PhoneCallModal), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Update)]
    public async Task<IActionResult> PhoneCallUpdate(PhoneCallModal request)
    {
        var response = await activityCommandHandler.PhoneCallUpdate(request);
        return Ok(response);
    }

    #endregion

    #region Task

    [HttpPost("get/task")]
    [ProducesResponseType(typeof(TaskModal), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Read)]
    public async Task<IActionResult> TaskRead(ActivityRequest request)
    {
        var response = await activityCommandHandler.TaskRead(request.Id);
        return Ok(response);
    }

    [HttpPost("create/task")]
    [ProducesResponseType(typeof(TaskModal), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Create)]
    public async Task<IActionResult> TaskCreate(TaskModal request)
    {
        var response = await activityCommandHandler.TaskCreate(request);
        return Ok(response);
    }

    [HttpPost("update/task")]
    [ProducesResponseType(typeof(TaskModal), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Update)]
    public async Task<IActionResult> TaskUpdate(TaskModal request)
    {
        var response = await activityCommandHandler.TaskUpdate(request);
        return Ok(response);
    }

    #endregion

    #region Email

    [HttpPost("get/email")]
    [ProducesResponseType(typeof(EmailModal), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Read)]
    public async Task<IActionResult> EmailRead(ActivityRequest request)
    {
        var response = await activityCommandHandler.EmailRead(request.Id);
        return Ok(response);
    }

    [HttpPost("create/email")]
    [ProducesResponseType(typeof(EmailModal), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Create)]
    public async Task<IActionResult> EmailCreate(EmailModal request)
    {
        var response = await activityCommandHandler.EmailCreate(request);
        return Ok(response);
    }

    [HttpPost("update/email")]
    [ProducesResponseType(typeof(EmailModal), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Update)]
    public async Task<IActionResult> EmailUpdate(EmailModal request)
    {
        var response = await activityCommandHandler.EmailUpdate(request);
        return Ok(response);
    }

    #endregion


    #region Common Function

    [HttpPost("delete")]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Delete)]
    public async Task<IActionResult> Delete(IdListRequest request)
    {
        await activityCommandHandler.Delete(request.Ids);
        return Ok();
    }

    [HttpPost("complete")]
    [ProducesResponseType(typeof(ActivityBaseModal), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.UpdateStatus)]
    public async Task<IActionResult> Complete(ActivityRequest request)
    {
        var response = await activityCommandHandler.Complete(request.Id);
        return Ok(response);
    }

    [HttpPost("cancel")]
    [ProducesResponseType(typeof(ActivityBaseModal), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.UpdateStatus)]
    public async Task<IActionResult> Cancel(ActivityRequest request)
    {
        var response = await activityCommandHandler.Cancel(request.Id);
        return Ok(response);
    }

    [HttpPost("bulk-update-status")]
    [ProducesResponseType(typeof(ActivityBaseModal), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.UpdateStatus)]
    public async Task<IActionResult> BulkUpdateStatus(ActivityBulkUpdateStatusRequest request)
    {
        await activityCommandHandler.BulkUpdateStatus(request.Ids, request.Status);
        return Ok();
    }

    [HttpPost("assign")]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.Assign)]
    public async Task<IActionResult> Assign(AssignRequest request)
    {
        await activityCommandHandler.AssignAsync(request.Ids, request.OwnerId);
        return Ok();
    }

    [HttpPost("set-state")]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.State)]
    public async Task<IActionResult> SetStateAsync(StatusRequest request)
    {
        await activityCommandHandler.SetStateAsync(request.Ids, request.IsActive);
        return Ok();
    }


    #endregion 

}
