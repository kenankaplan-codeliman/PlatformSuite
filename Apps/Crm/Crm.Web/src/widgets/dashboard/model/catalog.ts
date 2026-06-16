import type { DashboardWidgetMeta } from '@platform/ui';

/**
 * CRM dashboard widget kataloğu — @platform/ui DashboardContainer'a verilir.
 * 12 sütunluk grid: KPI=3, pipeline=8, wonLost=4, liste widget'ları=6.
 * titleKey'ler page.dashboard namespace'inde (DashboardPage getWidgetTitle ile çözer).
 */
export const dashboardCatalog: readonly DashboardWidgetMeta[] = [
  { key: 'openOpportunities', titleKey: 'widgets.openOpportunities', span: 3, hasOwnerScope: true },
  { key: 'wonThisMonth', titleKey: 'widgets.wonThisMonth', span: 3, hasOwnerScope: true },
  { key: 'newLeads', titleKey: 'widgets.newLeads', span: 3, hasOwnerScope: true },
  { key: 'conversionRate', titleKey: 'widgets.conversionRate', span: 3, hasOwnerScope: true },
  { key: 'pipeline', titleKey: 'widgets.pipeline', span: 8, hasOwnerScope: true },
  { key: 'wonLost', titleKey: 'widgets.wonLost', span: 4, hasOwnerScope: true },
  { key: 'myTasks', titleKey: 'widgets.myTasks', span: 6, hasOwnerScope: true },
  { key: 'leadsToAttention', titleKey: 'widgets.leadsToAttention', span: 6, hasOwnerScope: true },
  { key: 'closingOpportunities', titleKey: 'widgets.closingOpportunities', span: 6, hasOwnerScope: true },
  { key: 'recentActivities', titleKey: 'widgets.recentActivities', span: 6, hasOwnerScope: true },
  { key: 'topAccounts', titleKey: 'widgets.topAccounts', span: 6, hasOwnerScope: true },
  { key: 'recentRecords', titleKey: 'widgets.recentRecords', span: 6, hasOwnerScope: true },
];
