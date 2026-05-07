/**
 * Backend DTO'ları ile birebir uyumlu — `Platform.Application/Features/AppOrganizations/Dtos/**`.
 */

import type { EntityReference } from '../../../shared/types/EntityReference';

export type OrganizationType =
  | 'EXECUTIVE'
  | 'INTERNAL_SYSTEM'
  | 'DEPARTMENT'
  | 'ADVISORY'
  | 'REGION'
  | 'BRANCH';

export interface AppOrganizationDetailItem {
  id: string;
  organizationCode: string;
  organizationName: string;
  description: string;
  title?: string | null;
  type: OrganizationType;
  costCenter?: string | null;
  parentOrganization?: EntityReference | null;
  reportsTo?: EntityReference | null;
  isDefault: boolean;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AppOrganizationListItem {
  id: string;
  organizationCode: string;
  organizationName: string;
  title?: string | null;
  type: OrganizationType;
  costCenter?: string | null;
  parentOrganizationId?: string | null;
  parentOrganizationName?: string | null;
  isActive: boolean;
}

export interface AppOrganizationListFilter {
  organizationName?: string;
  organizationCode?: string;
  type?: OrganizationType;
  parentOrganizationId?: string;
  isActive?: boolean;
}

/** Form için kullanılan, API'ye gönderilen shape. */
export type AppOrganizationFormValues = Omit<
  AppOrganizationDetailItem,
  'createdAt' | 'updatedAt' | 'title'
>;
