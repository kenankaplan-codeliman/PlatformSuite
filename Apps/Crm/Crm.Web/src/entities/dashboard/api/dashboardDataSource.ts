import { httpClient } from '@platform/ui';
import type { PagedResult, PaginationRequest } from '@platform/ui';
import { CrmServicePath } from '../../../shared/api/servicePaths';
import type {
  ActivityDigestItem,
  ConversionRateItem,
  KpiCountItem,
  KpiValueItem,
  LeadDigestItem,
  OpportunityDigestItem,
  PipelineStageItem,
  RecentRecordItem,
  TopAccountItem,
  WonLostItem,
} from '../model/types';

interface OwnerPageBody {
  pagination: PaginationRequest;
  /** true → sadece oturum kullanıcısı; false → erişilebilir tüm organizasyon. */
  ownerOnly: boolean;
}

async function post<T>(url: string, body: unknown = {}): Promise<T> {
  const response = await httpClient.post<T>(url, body);
  return response.data;
}

const { Dashboard } = CrmServicePath;

export const dashboardDataSource = {
  // ── KPI (hepsi owner-switch destekler) ──
  openOpportunitiesKpi: (ownerOnly: boolean) =>
    post<KpiValueItem>(Dashboard.Kpi.OpenOpportunities, { ownerOnly }),
  wonThisMonthKpi: (ownerOnly: boolean) =>
    post<KpiValueItem>(Dashboard.Kpi.WonThisMonth, { ownerOnly }),
  newLeadsKpi: (ownerOnly: boolean) =>
    post<KpiCountItem>(Dashboard.Kpi.NewLeads, { ownerOnly }),
  conversionRateKpi: (ownerOnly: boolean) =>
    post<ConversionRateItem>(Dashboard.Kpi.ConversionRate, { ownerOnly }),

  // ── Aggregate (owner-switch destekler) ──
  pipeline: (ownerOnly: boolean) => post<PipelineStageItem[]>(Dashboard.Pipeline, { ownerOnly }),
  wonLost: (ownerOnly: boolean) => post<WonLostItem>(Dashboard.WonLost, { ownerOnly }),

  // ── Sayfalı listeler (hepsi owner-switch destekler) ──
  closingOpportunities: (body: OwnerPageBody) =>
    post<PagedResult<OpportunityDigestItem>>(Dashboard.ClosingOpportunities, body),
  leadsToAttention: (body: OwnerPageBody) =>
    post<PagedResult<LeadDigestItem>>(Dashboard.LeadsToAttention, body),
  topAccounts: (body: OwnerPageBody) =>
    post<PagedResult<TopAccountItem>>(Dashboard.TopAccounts, body),
  recentRecords: (body: OwnerPageBody) =>
    post<PagedResult<RecentRecordItem>>(Dashboard.RecentRecords, body),
  myTasks: (body: OwnerPageBody) =>
    post<PagedResult<ActivityDigestItem>>(Dashboard.MyTasks, body),
  recentActivities: (body: OwnerPageBody) =>
    post<PagedResult<ActivityDigestItem>>(Dashboard.RecentActivities, body),
};
