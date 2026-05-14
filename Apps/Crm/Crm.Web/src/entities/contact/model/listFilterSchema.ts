import { z } from 'zod';
import type { ContactListFilter } from './types';

// contactStatus GeneralParameter'a taşındı — statik const dizi yerine z.string().
export const contactListFilterSchema: z.ZodType<ContactListFilter> = z.object({
  contactName: z.string().optional(),
  accountId: z.string().uuid().optional(),
  contactStatus: z.string().optional(),
  title: z.string().optional(),
  department: z.string().optional(),
  isActive: z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
}) as z.ZodType<ContactListFilter>;

export const contactListFilterDefaults: ContactListFilter = {};
