// Opportunity Types - Based on Opportunity.cs Entity

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
  createdAt?: Date;
  updatedAt?: Date;
  isActive: boolean;
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
// LABELS
// =====================================================

const OpportunityStageLabels: Record<OpportunityStageValue, string> = {
  [OpportunityStage.Prospect]: 'Aday',
  [OpportunityStage.Qualification]: 'Nitelendirme',
  [OpportunityStage.Proposal]: 'Teklif',
  [OpportunityStage.Negotiation]: 'Müzakere',
  [OpportunityStage.Won]: 'Kazanıldı',
  [OpportunityStage.Lost]: 'Kaybedildi',
};

const OpportunitySourceLabels: Record<OpportunitySourceValue, string> = {
  [OpportunitySource.Web]: 'Web',
  [OpportunitySource.Referral]: 'Referans',
  [OpportunitySource.ColdCall]: 'Soğuk Arama',
  [OpportunitySource.EmailCampaign]: 'E-posta Kampanyası',
  [OpportunitySource.Event]: 'Etkinlik',
  [OpportunitySource.SocialMedia]: 'Sosyal Medya',
  [OpportunitySource.Partner]: 'İş Ortağı',
  [OpportunitySource.ExistingCustomer]: 'Mevcut Müşteri',
  [OpportunitySource.Other]: 'Diğer',
};

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
  OpportunityStageLabels[stage] ?? 'Bilinmiyor';

export const getOpportunityStageColor = (stage: OpportunityStageValue): string =>
  OpportunityStageColors[stage] ?? '#d9d9d9';

export const getOpportunitySourceLabel = (source: OpportunitySourceValue): string =>
  OpportunitySourceLabels[source] ?? 'Bilinmiyor';

export const formatCurrency = (value: number, currency = 'TRY'): string =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency }).format(value);

// =====================================================
// SELECT OPTIONS
// =====================================================

export const opportunityStageOptions = Object.entries(OpportunityStage).map(([, value]) => ({
  label: OpportunityStageLabels[value as OpportunityStageValue],
  value,
}));

export const opportunitySourceOptions = Object.entries(OpportunitySource).map(([, value]) => ({
  label: OpportunitySourceLabels[value as OpportunitySourceValue],
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