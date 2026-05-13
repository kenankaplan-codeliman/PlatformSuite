import { z } from 'zod';
import type { AccountListFilter } from './types';

/**
 * Account listesi filtre alanlarının sabit array'leri — `enumToOptions` için.
 * Detail form schema'sındaki `accountType` / `accountStatus` enum'larıyla aynı tutulmalı.
 */
export const ACCOUNT_TYPES = [
  'Customer',
  'Prospect',
  'Partner',
  'Vendor',
  'Competitor',
  'Other',
] as const;

export const ACCOUNT_STATUSES = [
  'Prospect',
  'Active',
  'AtRisk',
  'Inactive',
  'Churned',
] as const;

/**
 * URL query param'larından gelen string'leri `AccountListFilter`'a koerce eder.
 * Boş/eksik alanlar `undefined` döner — backend handler null-safe.
 */
export const accountListFilterSchema: z.ZodType<AccountListFilter> = z.object({
  accountName: z.string().optional(),
  accountType: z.enum(ACCOUNT_TYPES).optional(),
  accountStatus: z.enum(ACCOUNT_STATUSES).optional(),
  industry: z.string().optional(),
  isActive: z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
}) as z.ZodType<AccountListFilter>;

export const accountListFilterDefaults: AccountListFilter = {};
