import { z } from 'zod';

const skuSchema = z.object({
  supplierAccountId: z.string().uuid(),
  sku: z.string().min(1).max(25),
});

export const productSchema = z.object({
  id: z.string(),
  code: z.string().min(1, 'common:errors.required').max(25),
  name: z.string().min(1, 'common:errors.required').max(50),
  shortDescription: z.string().min(1, 'common:errors.required').max(50),
  detailedDescription: z.string().nullable().optional(),
  validFrom: z.string().min(1),
  validUntil: z.string().min(1),
  unitOfMeasure: z.string().max(50).nullable().optional(),
  manufacturerPartNumber: z.string().max(25).nullable().optional(),
  model: z.string().max(25).nullable().optional(),
  color: z.string().max(25).nullable().optional(),
  productUrl: z.string().nullable().optional(),
  quantityPerUnit: z.number().int().nullable().optional(),
  deliveryDays: z.number().int().nonnegative(),
  accountCodeId: z.string().uuid().nullable().optional(),
  productCategoryId: z.string().uuid(),
  isActive: z.boolean(),
  brandIds: z.array(z.string().uuid()),
  manufacturerIds: z.array(z.string().uuid()),
  keywords: z.array(z.string().max(100)),
  supplierSkus: z.array(skuSchema),
});
