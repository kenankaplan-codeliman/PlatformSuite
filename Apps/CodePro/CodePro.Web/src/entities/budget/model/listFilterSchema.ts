import { z } from 'zod';
import type { BudgetListFilter } from './types';

export const BUDGET_STATUSES = [
  'Draft',
  'InInternalApproval',
  'Active',
  'Depleted',
  'Expired',
  'Passive',
  'Rejected',
] as const;

export const BUDGET_PERIOD_TYPES = ['Yearly', 'Quarterly', 'Monthly', 'Custom'] as const;

export const budgetListFilterSchema: z.ZodType<BudgetListFilter> = z.object({
  search: z.string().optional(),
  status: z.enum(BUDGET_STATUSES).optional(),
  periodType: z.enum(BUDGET_PERIOD_TYPES).optional(),
  budgetCategoryId: z.string().uuid().optional(),
  isActive: z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
}) as z.ZodType<BudgetListFilter>;

export const budgetListFilterDefaults: BudgetListFilter = {};
