import { z } from 'zod';

const lineSchema = z.object({
  id: z.string(),
  isFreeProduct: z.boolean(),
  productId: z.string().uuid().nullable().optional(),
  productName: z.string().nullable().optional(),
  supplierAccountId: z.string().uuid().nullable().optional(),
  supplierAccountName: z.string().nullable().optional(),
  quantity: z.number().nonnegative(),
  unitOfMeasure: z.string().nullable().optional(),
  unitPrice: z.number().nullable().optional(),
  currency: z.string().nullable().optional(),
  totalAmount: z.number(),
  needByDate: z.string().nullable().optional(),
  buyerNotes: z.string().nullable().optional(),
  status: z.enum(['Setup', 'Approved', 'Rejected', 'Ordered', 'Cancelled']),
});

export const purchaseRequestSchema = z.object({
  id: z.string(),
  requestNumber: z.string().max(50),
  title: z.string().min(1, 'common:errors.required').max(300),
  description: z.string().nullable().optional(),
  status: z.enum([
    'Setup',
    'PendingApproval',
    'InPurchasing',
    'PartialOrderCreated',
    'OrderCreated',
    'Rejected',
    'Completed',
    'Cancelled',
  ]),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  requestDate: z.string(),
  requiredDate: z.string().nullable().optional(),
  currencyCode: z.string().max(10).nullable().optional(),
  lines: z.array(lineSchema),
});
