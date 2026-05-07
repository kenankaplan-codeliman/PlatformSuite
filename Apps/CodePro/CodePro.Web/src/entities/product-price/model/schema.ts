import { z } from 'zod';
import { entityReferenceSchema } from '@platform/ui';

export const productPriceSchema = z.object({
  id: z.string(),
  product: entityReferenceSchema.nullish(),
  supplierAccount: entityReferenceSchema.nullish(),
  priceList: entityReferenceSchema.nullish(),
  minimumQuantity: z.number().nonnegative(),
  validFrom: z.string().min(1),
  validUntil: z.string().min(1),
  unitPrice: z.number().positive(),
  currency: z.string().min(1).max(10),
  isActive: z.boolean(),
});
