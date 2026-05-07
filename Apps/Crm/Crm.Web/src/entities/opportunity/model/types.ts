/**
 * Backend DTO'ları ile birebir uyumlu — `Crm.Application/Features/Opportunities/Dtos/**`.
 */

import type { EntityReference } from '@platform/ui';

export type OpportunityStage =
  | 'Prospecting'
  | 'Qualification'
  | 'NeedsAnalysis'
  | 'Proposal'
  | 'Negotiation'
  | 'ClosedWon'
  | 'ClosedLost';

export interface OpportunityDetailItem {
  id: string;
  name: string;
  description?: string | null;
  account?: EntityReference | null;
  primaryContact?: EntityReference | null;
  stage: OpportunityStage;
  amount?: number | null;
  probability: number;
  closeDate?: string | null;
  lossReason?: string | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface OpportunityListItem {
  id: string;
  name: string;
  accountId: string;
  accountName?: string | null;
  stage: OpportunityStage;
  amount?: number | null;
  probability: number;
  closeDate?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface OpportunityListFilter {
  search?: string;
  stage?: OpportunityStage;
  accountId?: string;
  isActive?: boolean;
}

/** Form için kullanılan, API'ye gönderilen shape. */
export type OpportunityFormValues = Omit<
  OpportunityDetailItem,
  'createdAt' | 'updatedAt'
>;
