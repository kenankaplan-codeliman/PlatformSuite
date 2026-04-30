import { z } from 'zod';

export const productPriceSchema = z.object({
  id: z.string(),
  productId: z.string().uuid(),
  supplierAccountId: z.string().uuid(),
  priceListId: z.string().uuid().nullable().optional(),
  minimumQuantity: z.number().nonnegative(),
  validFrom: z.string().min(1),
  validUntil: z.string().min(1),
  unitPrice: z.number().positive(),
  currency: z.string().min(1).max(10),
  isActive: z.boolean(),
});
