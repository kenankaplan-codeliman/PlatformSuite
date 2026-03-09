using CRM.Application.Interfaces;
using CRM.Application.Modals.ActivityModal;
using CRM.Application.Modals.Common;
using CRM.Application.Modals.Dashboard;
using CRM.Application.Modals.LeadModal;
using CRM.Application.Modals.OpportunityModal;
using CRM.Domain.Entities.Opportunities;
using CRM.Domain.Enums;
using CRM.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace CRM.Infrastructure.Services;

public class DashboardStatsQueryService : IDashboardStats
{
    private readonly DatabaseContext dbContext;
    public DashboardStatsQueryService(DatabaseContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<DashboardAccountStats> AccountStatsAsync(CancellationToken ct = default)
    {
        var today = DateTime.UtcNow;
        var startOfMonth = new DateTime(today.Year, today.Month, 1);
        var startOfLastMonth = startOfMonth.AddMonths(-1);
        var endOfLastMonth = startOfMonth.AddDays(-1);

        var stats = await dbContext.Account.AsNoTracking().IgnoreAutoIncludes()
            .GroupBy(_ => 1)
            .Select(g => new
            {
                Total = g.Count(),
                ActiveCount = g.Count(a => a.IsActive)
            })
            .FirstOrDefaultAsync(ct);

        var thisMonthCount = await dbContext.Account.AsNoTracking().IgnoreAutoIncludes()
            .Where(a => a.CreatedAt >= startOfMonth && a.CreatedAt <= today)
            .CountAsync(ct);

        var lastMonthCount = await dbContext.Account.AsNoTracking().IgnoreAutoIncludes()
            .Where(a => a.CreatedAt >= startOfLastMonth && a.CreatedAt <= endOfLastMonth)
            .CountAsync(ct);

        var changePercent = lastMonthCount == 0 ? 0
            : Math.Round((decimal)(thisMonthCount - lastMonthCount) / lastMonthCount * 100, 2);

        return new DashboardAccountStats
        {
            Total = stats?.Total ?? 0,
            ActiveCount = stats?.ActiveCount ?? 0,
            ChangePercent = changePercent
        };
    }

    public async Task<DashboardLeadStats> LeadStatsAsync(CancellationToken ct = default)
    {
        var today = DateTime.UtcNow;
        var startOfMonth = new DateTime(today.Year, today.Month, 1);
        var startOfLastMonth = startOfMonth.AddMonths(-1);
        var endOfLastMonth = startOfMonth.AddDays(-1);

        var total = await dbContext.Lead.AsNoTracking().IgnoreAutoIncludes().Where(l => l.IsActive)
            .CountAsync(ct);

        var thisMonthCount = await dbContext.Lead.AsNoTracking().IgnoreAutoIncludes()
            .Where(l => l.IsActive && l.CreatedAt >= startOfMonth && l.CreatedAt <= today)
            .CountAsync(ct);

        var lastMonthCount = await dbContext.Lead.AsNoTracking().IgnoreAutoIncludes()
            .Where(l => l.IsActive && l.CreatedAt >= startOfLastMonth && l.CreatedAt <= endOfLastMonth)
            .CountAsync(ct);

        var changePercent = lastMonthCount == 0 ? 0
            : Math.Round((decimal)(thisMonthCount - lastMonthCount) / lastMonthCount * 100, 2);

        return new DashboardLeadStats
        {
            Total = total,
            ChangePercent = changePercent
        };
    }

    public async Task<DashboardOpportunityStats> OpportunityStatsAsync(CancellationToken ct = default)
    {
        var today = DateTime.UtcNow;
        var startOfMonth = new DateTime(today.Year, today.Month, 1);
        var startOfLastMonth = startOfMonth.AddMonths(-1);
        var endOfLastMonth = startOfMonth.AddDays(-1);

        // Tek sorguda tüm aggregate değerler
        var stats = await dbContext.Opportunity.AsNoTracking().IgnoreAutoIncludes().Where(o => o.IsActive)
            .GroupBy(_ => 1)
            .Select(g => new
            {
                Total = g.Count(),
                ActiveCount = g.Count(o =>
                                       o.Stage != OpportunityStage.Won
                                    && o.Stage != OpportunityStage.Lost
                                    ),

                TotalEstimatedValue = g.Sum(o => o.EstimatedValue),
                WonValue = g.Where(o => o.Stage == OpportunityStage.Won)
                            .Sum(o => o.ActualValue ?? o.EstimatedValue)
            })
            .FirstOrDefaultAsync(ct);

        var thisMonthCount = await dbContext.Opportunity.AsNoTracking().IgnoreAutoIncludes()
            .Where(o => o.IsActive && o.CreatedAt >= startOfMonth && o.CreatedAt <= today)
            .CountAsync(ct);

        var lastMonthCount = await dbContext.Opportunity.AsNoTracking().IgnoreAutoIncludes()
            .Where(o => o.IsActive && o.CreatedAt >= startOfLastMonth && o.CreatedAt <= endOfLastMonth)
            .CountAsync(ct);

        var changePercent = lastMonthCount == 0 ? 0
            : Math.Round((decimal)(thisMonthCount - lastMonthCount) / lastMonthCount * 100, 2);

        return new DashboardOpportunityStats
        {
            Total = stats?.Total ?? 0,
            ActiveCount = stats?.ActiveCount ?? 0,
            TotalEstimatedValue = stats?.TotalEstimatedValue ?? 0,
            WonValue = stats?.WonValue ?? 0,
            ChangePercent = changePercent
        };
    }

    public async Task<DashboardRevenueStats> RevenueStatsAsync(CancellationToken ct = default)
    {
        var today = DateTime.UtcNow;
        var startOfMonth = new DateTime(today.Year, today.Month, 1);
        var startOfLastMonth = startOfMonth.AddMonths(-1);
        var endOfLastMonth = startOfMonth.AddDays(-1);

        // Bu ayın cirosu (MTD)
        var mtd = await dbContext.Opportunity.AsNoTracking().IgnoreAutoIncludes()
            .Where(o => o.Stage == OpportunityStage.Won
                     && o.CloseDate >= startOfMonth
                     && o.CloseDate <= today)
            .SumAsync(o => o.EstimatedValue, ct);

        // Geçen ayın cirosu (karşılaştırma için)
        var lastMonthRevenue = await dbContext.Opportunity.AsNoTracking().IgnoreAutoIncludes()
            .Where(o => o.Stage == OpportunityStage.Won
                     && o.CloseDate >= startOfLastMonth
                     && o.CloseDate <= endOfLastMonth)
            .SumAsync(o => o.EstimatedValue, ct);

        // Değişim yüzdesi
        var changePercent = lastMonthRevenue == 0 ? 0
            : ((mtd - lastMonthRevenue) / lastMonthRevenue) * 100;

        return new DashboardRevenueStats
        {
            Mtd = mtd,
            ChangePercent = Math.Round(changePercent, 2),
            Currency = "TRY"
        };
    }

    public async Task<List<LeadListItem>> RecentLeadsAsync(CancellationToken ct = default)
    {
        var items = await dbContext.Lead.AsNoTracking().IgnoreAutoIncludes()
        .Where(l => l.IsActive)
        .OrderByDescending(l => l.CreatedAt)
        .Take(5)
        .Select(l => new LeadListItem()
        {
            id = l.Id,
            CompanyName = l.CompanyName,
            FirstName = l.FirstName,
            LastName = l.LastName,
            Email = l.Email,
            MobilePhone = l.MobilePhone,
            LeadStatus = l.LeadStatus,
            LeadRating = l.LeadRating,
            Industry = l.Industry,
            EstimatedValue = l.EstimatedValue,
            IsActive = l.IsActive
        })
        .ToListAsync(ct);

        return items;
    }

}