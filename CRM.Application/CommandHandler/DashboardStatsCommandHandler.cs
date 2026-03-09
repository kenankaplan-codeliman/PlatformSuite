using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Modals.ActivityModal;
using CRM.Application.Modals.Dashboard;
using CRM.Application.Modals.LeadModal;
using CRM.Application.Modals.OpportunityModal;

namespace CRM.Application.CommandHandler;

public class DashboardStatsCommandHandler
{
    private readonly IDashboardStats dashboardStatsQuery;
    private readonly IActivityRepository activityRepository;

    public DashboardStatsCommandHandler(IDashboardStats dashboardStatsQuery, IActivityRepository activityRepository)
    {
        this.dashboardStatsQuery = dashboardStatsQuery;
        this.activityRepository = activityRepository;
    }

    public async Task<DashboardLeadStats> GetLeadStatsAsync()
    {
        var result = await dashboardStatsQuery.LeadStatsAsync();
        return result;
    }

    public async Task<DashboardAccountStats> GetAccountStatsAsync()
    {
        var result = await dashboardStatsQuery.AccountStatsAsync();
        return result;
    }

    public async Task<DashboardOpportunityStats> GetOpportunityStatsAsync()
    {
        var result = await dashboardStatsQuery.OpportunityStatsAsync();
        return result;
    }

    public async Task<DashboardRevenueStats> GetRevenueStatsAsync()
    {
        var result = await dashboardStatsQuery.RevenueStatsAsync();
        return result;
    }

    public async Task<List<LeadListItem>> GetRecentLeads()
    {
        var result = await dashboardStatsQuery.RecentLeadsAsync();
        return result;
    }

    public async Task<List<ActivityListItem>> GetUpcomingActivities()
    {
        var result = await activityRepository.UpcomingActivitiesAsync();
        return result;
    }
}
