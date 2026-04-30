import { z } from 'zod';

const lineSchema = z.object({
  id: z.string(),
  purchaseRequestLineId: z.string().uuid().nullable().optional(),
  isFreeProduct: z.boolean(),
  productId: z.string().uuid().nullable().optional(),
  productName: z.string().nullable().optional(),
  quantity: z.number().nonnegative(),
  unitOfMeasure: z.string().nullable().optional(),
  unitPrice: z.number().nullable().optional(),
  currency: z.string().nullable().optional(),
  totalAmount: z.number(),
  needByDate: z.string().nullable().optional(),
  buyerNotes: z.string().nullable().optional(),
  status: z.enum(['Draft', 'Sent', 'Acknowledged', 'PartialDelivered', 'Delivered', 'Cancelled']),
});

export const purchaseOrderSchema = z.object({
  id: z.string(),
  orderNumber: z.string().max(50),
  title: z.string().min(1).max(300),
  description: z.string().nullable().optional(),
  supplierAccountId: z.string().uuid(),
  purchaseRequestId: z.string().uuid().nullable().optional(),
  status: z.enum(['Draft', 'Sent', 'Acknowledged', 'PartialDelivered', 'Delivered', 'Cancelled', 'Closed']),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  orderDate: z.string(),
  expectedDeliveryDate: z.string().nullable().optional(),
  currencyCode: z.string().max(10).nullable().optional(),
  lines: z.array(lineSchema),
});
