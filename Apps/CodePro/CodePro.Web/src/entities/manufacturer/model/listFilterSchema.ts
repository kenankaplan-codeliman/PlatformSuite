import { z } from 'zod';
import type { ManufacturerListFilter } from './types';

export const manufacturerListFilterSchema: z.ZodType<ManufacturerListFilter> = z.object({
  search: z.string().optional(),
  isActive: z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
}) as z.ZodType<ManufacturerListFilter>;

export const manufacturerListFilterDefaults: ManufacturerListFilter = {};
