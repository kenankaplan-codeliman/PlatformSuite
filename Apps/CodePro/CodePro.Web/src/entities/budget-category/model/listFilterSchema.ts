import { z } from 'zod';
import type { BudgetCategoryListFilter } from './types';

export const budgetCategoryListFilterSchema: z.ZodType<BudgetCategoryListFilter> = z.object({
  search: z.string().optional(),
  parentCategoryId: z.string().uuid().nullable().optional(),
  isActive: z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
}) as z.ZodType<BudgetCategoryListFilter>;

export const budgetCategoryListFilterDefaults: BudgetCategoryListFilter = {};
