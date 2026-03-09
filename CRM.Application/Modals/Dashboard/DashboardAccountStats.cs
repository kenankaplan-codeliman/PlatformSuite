using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Modals.Dashboard;

public class DashboardAccountStats
{
    public int Total { get; set; }
    public int ActiveCount { get; set; }
    public decimal ChangePercent { get; set; }
}
