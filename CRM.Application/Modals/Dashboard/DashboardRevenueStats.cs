using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Modals.Dashboard;

public class DashboardRevenueStats
{
    public decimal Mtd { get; set; }
    public decimal ChangePercent { get; set; }
    public string Currency { get; set; } = string.Empty;
}
