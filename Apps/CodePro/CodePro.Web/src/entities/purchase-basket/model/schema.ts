import { z } from 'zod';

const lineSchema = z.object({
  id: z.string(),
  productId: z.string().uuid(),
  productCode: z.string().nullable().optional(),
  productName: z.string().nullable().optional(),
  quantity: z.number().int().positive(),
});

export const purchaseBasketSchema = z.object({
  id: z.string(),
  status: z.enum(['Preparing', 'Submitted', 'Cancelled']),
  purchaseRequestId: z.string().uuid().nullable().optional(),
  lines: z.array(lineSchema),
});
