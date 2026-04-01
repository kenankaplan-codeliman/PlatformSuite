// Opportunity Types - Based on Opportunity.cs Entity

import type { AuditInfo } from "./common.types";
import i18n from '@/config/i18n.config';

// =====================================================
// ENUMS
// =====================================================

export const OpportunityStage = {
  Prospect: 'prospect',
  Qualification: 'qualification',
  Proposal: 'proposal',
  Negotiation: 'negotiation',
  Won: 'won',
  Lost: 'lost',
} as const;

export type OpportunityStageValue = (typeof OpportunityStage)[keyof typeof OpportunityStage];

export const OpportunitySource = {
  Web: 'web',
  Referral: 'referral',
  ColdCall: 'coldCall',
  EmailCampaign: 'emailCampaign',
  Event: 'event',
  SocialMedia: 'socialMedia',
  Partner: 'partner',
  ExistingCustomer: 'existingCustomer',
  Other: 'other',
} as const;

export type OpportunitySourceValue = (typeof OpportunitySource)[keyof typeof OpportunitySource];

// =====================================================
// MAIN INTERFACES
// =====================================================

export interface OpportunityListItem {
  id: string;
  name: string;
  stage: OpportunityStageValue;
  probability: number;
  estimatedValue: number;
  actualValue?: number;
  currency: string;
  closeDate?: string;
  source?: OpportunitySourceValue;
  accountId: string;
  accountName?: string;
  contactId?: string;
  contactName?: string;
  isActive: boolean;
}

export interface OpportunityProductItem {
  id?: string;
  productId: string;
  productName?: string;
}

export interface OpportunityDetailItem {
  id: string;
  name: string;
  description?: string;
  stage: OpportunityStageValue;
  probability: number;
  estimatedValue: number;
  actualValue?: number;
  currency: string;
  closeDate?: string;
  source?: OpportunitySourceValue;
  accountId: string;
  accountName?: string;
  contactId?: string;
  contactName?: string;
  products: OpportunityProductItem[];

  isActive: boolean;
  
  audit?: AuditInfo;
}

// =====================================================
// REQUEST / RESPONSE
// =====================================================

export interface OpportunityListFilters {
  name?: string;
  stage?: OpportunityStageValue;
  accountId?: string;
  source?: OpportunitySourceValue;
  isActive?: boolean;
}

export interface OpportunityListRequest {
  page: number;
  pageSize: number;
  filters?: OpportunityListFilters;
}

export interface OpportunityListResponse {
  data: OpportunityListItem[];
  hasMore: boolean;
  page: number;
  pageSize: number;
}

// =====================================================
// COLORS
// =====================================================

const OpportunityStageColors: Record<OpportunityStageValue, string> = {
  [OpportunityStage.Prospect]: '#6366f1',
  [OpportunityStage.Qualification]: '#3b82f6',
  [OpportunityStage.Proposal]: '#f97316',
  [OpportunityStage.Negotiation]: '#8b5cf6',
  [OpportunityStage.Won]: '#22c55e',
  [OpportunityStage.Lost]: '#ef4444',
};

// =====================================================
// HELPER FUNCTIONS
// =====================================================

export const getOpportunityStageLabel = (stage: OpportunityStageValue): string =>
  i18n.t(`enums:opportunityStage.${stage}`, { defaultValue: stage });

export const getOpportunityStageColor = (stage: OpportunityStageValue): string =>
  OpportunityStageColors[stage] ?? '#d9d9d9';

export const getOpportunitySourceLabel = (source: OpportunitySourceValue): string =>
  i18n.t(`enums:opportunitySource.${source}`, { defaultValue: source });

export const formatCurrency = (value: number, currency = 'TRY'): string =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency }).format(value);

// =====================================================
// SELECT OPTIONS
// =====================================================

export const opportunityStageOptions = Object.values(OpportunityStage).map((value) => ({
  label: getOpportunityStageLabel(value),
  value,
}));

export const opportunitySourceOptions = Object.values(OpportunitySource).map((value) => ({
  label: getOpportunitySourceLabel(value),
  value,
}));

// Kanban kolon sıralaması
export const KANBAN_STAGE_ORDER: OpportunityStageValue[] = [
  OpportunityStage.Prospect,
  OpportunityStage.Qualification,
  OpportunityStage.Proposal,
  OpportunityStage.Negotiation,
  OpportunityStage.Won,
  OpportunityStage.Lost,
];