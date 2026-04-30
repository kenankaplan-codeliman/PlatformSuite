using Platform.Api.Authorization;
using Platform.Api.Extensions;
using Platform.Application.Features.Activities.Commands.AssignActivity;
using Platform.Application.Features.Activities.Commands.BulkUpdateStatusActivity;
using Platform.Application.Features.Activities.Commands.CancelActivity;
using Platform.Application.Features.Activities.Commands.CompleteActivity;
using Platform.Application.Features.Activities.Commands.CreateAppointmentActivity;
using Platform.Application.Features.Activities.Commands.CreateEmailActivity;
using Platform.Application.Features.Activities.Commands.CreatePhoneCallActivity;
using Platform.Application.Features.Activities.Commands.CreateTaskActivity;
using Platform.Application.Features.Activities.Commands.DeleteActivity;
using Platform.Application.Features.Activities.Commands.SetStateActivity;
using Platform.Application.Features.Activities.Commands.UpdateAppointmentActivity;
using Platform.Application.Features.Activities.Commands.UpdateEmailActivity;
using Platform.Application.Features.Activities.Commands.UpdatePhoneCallActivity;
using Platform.Application.Features.Activities.Commands.UpdateTaskActivity;
using Platform.Application.Features.Activities.Queries.CalendarActivities;
using Platform.Application.Features.Activities.Queries.GetAppointmentActivity;
using Platform.Application.Features.Activities.Queries.GetEmailActivity;
using Platform.Application.Features.Activities.Queries.GetPhoneCallActivity;
using Platform.Application.Features.Activities.Queries.GetTaskActivity;
using Platform.Application.Features.Activities.Queries.ListActivities;
using Platform.Domain.Authorization;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Platform.Api.Controllers;

[ApiController]
[Route("api/activity")]
public sealed class ActivityController : ControllerBase
{
    private readonly ISender _sender;

    public ActivityController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Read)]
    public async Task<IActionResult> List([FromBody] ListActivitiesQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("calendar")]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Read)]
    public async Task<IActionResult> Calendar([FromBody] CalendarActivitiesQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    // ─── Appointment ─────────────────────────────────────────────────────

    [HttpPost("get/appointment")]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Read)]
    public async Task<IActionResult> AppointmentRead([FromBody] GetAppointmentActivityQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create/appointment")]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Create)]
    public async Task<IActionResult> AppointmentCreate([FromBody] CreateAppointmentActivityCommand cmd, CancellationToken ct)
        => (await _sender.Send(cmd, ct)).ToActionResult(HttpContext);

    [HttpPost("update/appointment")]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Update)]
    public async Task<IActionResult> AppointmentUpdate([FromBody] UpdateAppointmentActivityCommand cmd, CancellationToken ct)
        => (await _sender.Send(cmd, ct)).ToActionResult(HttpContext);

    // ─── PhoneCall ────────────────────────────────────────────────────────

    [HttpPost("get/phonecall")]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Read)]
    public async Task<IActionResult> PhoneCallRead([FromBody] GetPhoneCallActivityQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create/phonecall")]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Create)]
    public async Task<IActionResult> PhoneCallCreate([FromBody] CreatePhoneCallActivityCommand cmd, CancellationToken ct)
        => (await _sender.Send(cmd, ct)).ToActionResult(HttpContext);

    [HttpPost("update/phonecall")]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Update)]
    public async Task<IActionResult> PhoneCallUpdate([FromBody] UpdatePhoneCallActivityCommand cmd, CancellationToken ct)
        => (await _sender.Send(cmd, ct)).ToActionResult(HttpContext);

    // ─── Task ─────────────────────────────────────────────────────────────

    [HttpPost("get/task")]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Read)]
    public async Task<IActionResult> TaskRead([FromBody] GetTaskActivityQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create/task")]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Create)]
    public async Task<IActionResult> TaskCreate([FromBody] CreateTaskActivityCommand cmd, CancellationToken ct)
        => (await _sender.Send(cmd, ct)).ToActionResult(HttpContext);

    [HttpPost("update/task")]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Update)]
    public async Task<IActionResult> TaskUpdate([FromBody] UpdateTaskActivityCommand cmd, CancellationToken ct)
        => (await _sender.Send(cmd, ct)).ToActionResult(HttpContext);

    // ─── Email ────────────────────────────────────────────────────────────

    [HttpPost("get/email")]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Read)]
    public async Task<IActionResult> EmailRead([FromBody] GetEmailActivityQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create/email")]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Create)]
    public async Task<IActionResult> EmailCreate([FromBody] CreateEmailActivityCommand cmd, CancellationToken ct)
        => (await _sender.Send(cmd, ct)).ToActionResult(HttpContext);

    [HttpPost("update/email")]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Update)]
    public async Task<IActionResult> EmailUpdate([FromBody] UpdateEmailActivityCommand cmd, CancellationToken ct)
        => (await _sender.Send(cmd, ct)).ToActionResult(HttpContext);

    // ─── Common ───────────────────────────────────────────────────────────

    [HttpPost("delete")]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Delete)]
    public async Task<IActionResult> Delete([FromBody] DeleteActivityCommand cmd, CancellationToken ct)
        => (await _sender.Send(cmd, ct)).ToActionResult(HttpContext);

    [HttpPost("complete")]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.UpdateStatus)]
    public async Task<IActionResult> Complete([FromBody] CompleteActivityCommand cmd, CancellationToken ct)
        => (await _sender.Send(cmd, ct)).ToActionResult(HttpContext);

    [HttpPost("cancel")]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.UpdateStatus)]
    public async Task<IActionResult> Cancel([FromBody] CancelActivityCommand cmd, CancellationToken ct)
        => (await _sender.Send(cmd, ct)).ToActionResult(HttpContext);

    [HttpPost("bulk-update-status")]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.UpdateStatus)]
    public async Task<IActionResult> BulkUpdateStatus([FromBody] BulkUpdateStatusActivityCommand cmd, CancellationToken ct)
        => (await _sender.Send(cmd, ct)).ToActionResult(HttpContext);

    [HttpPost("assign")]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.Assign)]
    public async Task<IActionResult> Assign([FromBody] AssignActivityCommand cmd, CancellationToken ct)
        => (await _sender.Send(cmd, ct)).ToActionResult(HttpContext);

    [HttpPost("set-state")]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.State)]
    public async Task<IActionResult> SetStateAsync([FromBody] SetStateActivityCommand cmd, CancellationToken ct)
        => (await _sender.Send(cmd, ct)).ToActionResult(HttpContext);
}
