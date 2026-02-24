// Dashboard Types

export interface DashboardLeadStats {
  total: number;
  changePercent: number;
}

export interface DashboardAccountStats {
  total: number;
  activeCount: number;
  changePercent: number;
}

export interface DashboardOpportunityStats {
  total: number;
  activeCount: number;
  totalEstimatedValue: number;
  wonValue: number;
  changePercent: number;
}

export interface DashboardRevenueStats {
  mtd: number;          // Month-to-date
  changePercent: number;
  currency: string;
}

