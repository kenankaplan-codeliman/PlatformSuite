import { z } from 'zod';

export const productCatalogSchema = z.object({
  id: z.string(),
  code: z.string().min(1, 'common:errors.required').max(25),
  name: z.string().min(1, 'common:errors.required').max(100),
  description: z.string().max(1000).nullable().optional(),
  validFrom: z.string().min(1),
  validUntil: z.string().min(1),
  priceCode: z.string().max(50).nullable().optional(),
  isActive: z.boolean(),
  productIds: z.array(z.string().uuid()),
  organizationIds: z.array(z.string().uuid()),
});
