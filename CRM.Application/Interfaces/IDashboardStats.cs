
using CRM.Application.Modals.ActivityModal;
using CRM.Application.Modals.Dashboard;
using CRM.Application.Modals.LeadModal;

namespace CRM.Application.Interfaces;

public interface IDashboardStats
{
    Task<DashboardLeadStats> LeadStatsAsync(CancellationToken ct = default);
    Task<DashboardAccountStats> AccountStatsAsync(CancellationToken ct = default);
    Task<DashboardOpportunityStats> OpportunityStatsAsync(CancellationToken ct = default);
    Task<DashboardRevenueStats> RevenueStatsAsync(CancellationToken ct = default);
    Task<List<LeadListItem>> RecentLeadsAsync(CancellationToken ct = default);
}
