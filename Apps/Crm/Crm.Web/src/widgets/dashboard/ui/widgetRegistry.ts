import type { DashboardComponentMap } from '@platform/ui';
import { KpiOpenOpportunitiesWidget } from './widgets/KpiOpenOpportunitiesWidget';
import { KpiWonThisMonthWidget } from './widgets/KpiWonThisMonthWidget';
import { KpiNewLeadsWidget } from './widgets/KpiNewLeadsWidget';
import { KpiConversionRateWidget } from './widgets/KpiConversionRateWidget';
import { PipelineWidget } from './widgets/PipelineWidget';
import { WonLostWidget } from './widgets/WonLostWidget';
import { MyTasksWidget } from './widgets/MyTasksWidget';
import { LeadsToAttentionWidget } from './widgets/LeadsToAttentionWidget';
import { ClosingOpportunitiesWidget } from './widgets/ClosingOpportunitiesWidget';
import { RecentActivitiesWidget } from './widgets/RecentActivitiesWidget';
import { TopAccountsWidget } from './widgets/TopAccountsWidget';
import { RecentRecordsWidget } from './widgets/RecentRecordsWidget';

/** Katalog key'i → CRM widget bileşeni. @platform/ui DashboardContainer'a verilir. */
export const dashboardComponents: DashboardComponentMap = {
  openOpportunities: KpiOpenOpportunitiesWidget,
  wonThisMonth: KpiWonThisMonthWidget,
  newLeads: KpiNewLeadsWidget,
  conversionRate: KpiConversionRateWidget,
  pipeline: PipelineWidget,
  wonLost: WonLostWidget,
  myTasks: MyTasksWidget,
  leadsToAttention: LeadsToAttentionWidget,
  closingOpportunities: ClosingOpportunitiesWidget,
  recentActivities: RecentActivitiesWidget,
  topAccounts: TopAccountsWidget,
  recentRecords: RecentRecordsWidget,
};
