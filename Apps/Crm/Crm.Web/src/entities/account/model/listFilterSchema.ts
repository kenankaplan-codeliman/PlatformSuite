import { z } from 'zod';
import type { AccountListFilter } from './types';

/**
 * URL query param'larından gelen string'leri `AccountListFilter`'a koerce eder.
 * Boş/eksik alanlar `undefined` döner — backend handler null-safe.
 *
 * accountType / accountStatus GeneralParameter'a taşındı — statik const dizi yerine z.string().
 */
export const accountListFilterSchema: z.ZodType<AccountListFilter> = z.object({
  accountName: z.string().optional(),
  accountType: z.string().optional(),
  accountStatus: z.string().optional(),
  industry: z.string().optional(),
  isActive: z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
}) as z.ZodType<AccountListFilter>;

export const accountListFilterDefaults: AccountListFilter = {};
