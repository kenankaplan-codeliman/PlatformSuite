/**
 * Dashboard widget DTO tipleri — Crm.Application/Features/Dashboard/Dtos ile birebir (camelCase).
 */

export interface KpiValueItem {
  count: number;
  totalValue: number;
}

export interface KpiCountItem {
  count: number;
}

export interface ConversionRateItem {
  totalCount: number;
  convertedCount: number;
  /** 0-100 arası yüzde. */
  rate: number;
}

export interface WonLostItem {
  wonCount: number;
  wonValue: number;
  lostCount: number;
  lostValue: number;
}

export interface PipelineStageItem {
  stage: string;
  count: number;
  totalValue: number;
}

export interface TopAccountItem {
  accountId: string;
  accountName: string;
  openOpportunityCount: number;
  openOpportunityValue: number;
}

export interface OpportunityDigestItem {
  id: string;
  name: string;
  opportunityCode?: string | null;
  accountId: string;
  accountName?: string | null;
  stage: string;
  amount?: number | null;
  currency?: string | null;
  probability: number;
  closeDate?: string | null;
}

export interface ActivityDigestItem {
  id: string;
  subject: string;
  activityType: string;
  status: string;
  priority: string;
  startDate?: string | null;
  dueDate?: string | null;
  regardingEntityType?: string | null;
  regardingEntityId?: string | null;
  createdAt: string;
}

export interface LeadDigestItem {
  id: string;
  subject: string;
  fullName?: string | null;
  company?: string | null;
  rating?: string | null;
  status: string;
  score?: number | null;
  estimatedValue?: number | null;
  createdAt: string;
}

export interface RecentRecordItem {
  id: string;
  /** "Account" | "Contact" */
  entityType: string;
  name: string;
  createdAt: string;
}
