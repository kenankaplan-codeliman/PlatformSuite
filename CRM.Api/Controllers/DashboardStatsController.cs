using CRM.Api.Authorization;
using CRM.Api.Contracts.Requests.Lead;
using CRM.Application.CommandHandler;
using CRM.Application.Modals.ActivityModal;
using CRM.Application.Modals.Common;
using CRM.Application.Modals.Dashboard;
using CRM.Application.Modals.LeadModal;
using CRM.Domain.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.Api.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardStatsController : Controller
{
    private readonly DashboardStatsCommandHandler dashboardStatsController;

    public DashboardStatsController(DashboardStatsCommandHandler dashboardStatsController)
    {
        this.dashboardStatsController = dashboardStatsController;
    }

    [HttpGet("lead-stats")]
    [ProducesResponseType(typeof(DashboardLeadStats), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.LeadPrivilegeCodes.Read)]
    public async Task<IActionResult> GetLeadStats()
    {
        var response = await dashboardStatsController.GetLeadStatsAsync();
        return Ok(response);
    }

    [HttpGet("account-stats")]
    [ProducesResponseType(typeof(DashboardAccountStats), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.AccountPrivilegeCodes.Read)]
    public async Task<IActionResult> GetAccountStats()
    {
        var response = await dashboardStatsController.GetAccountStatsAsync();
        return Ok(response);
    }

    [HttpGet("opportunity-stats")]
    [ProducesResponseType(typeof(DashboardOpportunityStats), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.OpportunityPrivilegeCodes.Read)]
    public async Task<IActionResult> GetOpportunityStats()
    {
        var response = await dashboardStatsController.GetOpportunityStatsAsync();
        return Ok(response);
    }

    [HttpGet("revenue-stats")]
    [ProducesResponseType(typeof(DashboardRevenueStats), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.OpportunityPrivilegeCodes.Read)]
    public async Task<IActionResult> GetRevenueStats()
    {
        var response = await dashboardStatsController.GetRevenueStatsAsync();
        return Ok(response);
    }

    [HttpGet("recent-leads")]
    [ProducesResponseType(typeof(List<LeadListItem>), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.LeadPrivilegeCodes.Read)]
    public async Task<IActionResult> GetRecentLeads()
    {
        var response = await dashboardStatsController.GetRecentLeads();
        return Ok(response);
    }

    [HttpGet("upcoming-activities")]
    [ProducesResponseType(typeof(List<ActivityListItem>), 200)]
    [PrivilegeAuthorize(PrivilegeCodes.ActivityPrivilegeCodes.Read)]
    public async Task<IActionResult> GetUpcomingActivities()
    {
        var response = await dashboardStatsController.GetUpcomingActivities();
        return Ok(response);
    }
}
