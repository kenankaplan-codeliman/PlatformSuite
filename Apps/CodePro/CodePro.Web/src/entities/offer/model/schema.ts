import { z } from 'zod';

const itemSchema = z.object({
  id: z.string(),
  orderIndex: z.number().int().nonnegative(),
  productId: z.string().uuid().nullable().optional(),
  productName: z.string().min(1).max(500),
  quantity: z.number().nonnegative(),
  unit: z.enum(['Piece', 'Kg', 'Meter', 'Liter', 'Hour', 'Day', 'Month', 'Year']),
  unitPrice: z.number().nonnegative(),
  vatRate: z.enum(['Zero', 'One', 'Ten', 'Twenty']),
  lineTotal: z.number(),
  lineVat: z.number(),
});

export const offerSchema = z.object({
  id: z.string(),
  offerNumber: z.string().min(1).max(50),
  offerType: z.enum(['Sales', 'Purchase']),
  subject: z.string().min(1).max(500),
  counterpartyName: z.string().min(1).max(300),
  counterpartyId: z.string().uuid().nullable().optional(),
  responsibleUserId: z.string().uuid(),
  validFrom: z.string().nullable().optional(),
  validUntil: z.string(),
  currency: z.string().min(1).max(10),
  discountPercentage: z.number().min(0).max(100),
  notes: z.string().nullable().optional(),
  status: z.enum([
    'Draft', 'PendingInternalApproval', 'InternallyApproved', 'PendingExternalApproval',
    'Sent', 'Won', 'Lost', 'Cancelled', 'Expired',
  ]),
  items: z.array(itemSchema),
});
