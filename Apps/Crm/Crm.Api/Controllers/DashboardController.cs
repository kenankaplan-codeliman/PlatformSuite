using Crm.Application.Features.Dashboard.Queries.GetConversionRateKpi;
using Crm.Application.Features.Dashboard.Queries.GetNewLeadsKpi;
using Crm.Application.Features.Dashboard.Queries.GetOpenOpportunitiesKpi;
using Crm.Application.Features.Dashboard.Queries.GetSalesPipeline;
using Crm.Application.Features.Dashboard.Queries.GetWonLostSummary;
using Crm.Application.Features.Dashboard.Queries.GetWonThisMonthKpi;
using Crm.Application.Features.Dashboard.Queries.ListClosingOpportunities;
using Crm.Application.Features.Dashboard.Queries.ListLeadsToAttention;
using Crm.Application.Features.Dashboard.Queries.ListMyTasks;
using Crm.Application.Features.Dashboard.Queries.ListRecentActivities;
using Crm.Application.Features.Dashboard.Queries.ListRecentRecords;
using Crm.Application.Features.Dashboard.Queries.ListTopAccounts;
using Crm.Domain.Authorization;
using Platform.Api.Authorization;
using Platform.Api.Extensions;
using Platform.Domain.Authorization;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Crm.Api.Controllers;

/// <summary>
/// Dashboard widget'larının bağımsız read endpoint'leri. Her widget kendi endpoint'ini
/// asenkron çağırır; her metot ilgili entity'nin Read privilege'ı ile korunur.
/// </summary>
[ApiController]
[Route("api/dashboard")]
public sealed class DashboardController : ControllerBase
{
    private readonly ISender _sender;

    public DashboardController(ISender sender) => _sender = sender;

    // ======= KPI =======

    [HttpPost("kpi/open-opportunities")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.OpportunityPrivilegeCodes.Read)]
    public async Task<IActionResult> OpenOpportunitiesKpiAsync([FromBody] GetOpenOpportunitiesKpiQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("kpi/won-this-month")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.OpportunityPrivilegeCodes.Read)]
    public async Task<IActionResult> WonThisMonthKpiAsync([FromBody] GetWonThisMonthKpiQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("kpi/new-leads")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.LeadPrivilegeCodes.Read)]
    public async Task<IActionResult> NewLeadsKpiAsync([FromBody] GetNewLeadsKpiQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("kpi/conversion-rate")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.LeadPrivilegeCodes.Read)]
    public async Task<IActionResult> ConversionRateKpiAsync([FromBody] GetConversionRateKpiQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    // ======= Ana widget'lar =======

    [HttpPost("pipeline")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.OpportunityPrivilegeCodes.Read)]
    public async Task<IActionResult> PipelineAsync([FromBody] GetSalesPipelineQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("closing-opportunities")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.OpportunityPrivilegeCodes.Read)]
    public async Task<IActionResult> ClosingOpportunitiesAsync([FromBody] ListClosingOpportunitiesQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("my-tasks")]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Read)]
    public async Task<IActionResult> MyTasksAsync([FromBody] ListMyTasksQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("leads-to-attention")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.LeadPrivilegeCodes.Read)]
    public async Task<IActionResult> LeadsToAttentionAsync([FromBody] ListLeadsToAttentionQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("recent-activities")]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Read)]
    public async Task<IActionResult> RecentActivitiesAsync([FromBody] ListRecentActivitiesQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    // ======= İkincil widget'lar =======

    [HttpPost("top-accounts")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.OpportunityPrivilegeCodes.Read)]
    public async Task<IActionResult> TopAccountsAsync([FromBody] ListTopAccountsQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("won-lost")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.OpportunityPrivilegeCodes.Read)]
    public async Task<IActionResult> WonLostAsync([FromBody] GetWonLostSummaryQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("recent-records")]
    [PrivilegeAuthorize(CrmPrivilegeCodes.AccountPrivilegeCodes.Read)]
    public async Task<IActionResult> RecentRecordsAsync([FromBody] ListRecentRecordsQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);
}
