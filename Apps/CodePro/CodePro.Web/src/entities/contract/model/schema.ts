import { z } from 'zod';

export const contractSchema = z.object({
  id: z.string(),
  contractNumber: z.string().min(1).max(50),
  subject: z.string().min(1).max(500),
  type: z.enum(['Sales', 'Purchase', 'Service', 'Nda', 'Framework', 'Other']),
  counterpartyName: z.string().min(1).max(300),
  counterpartyId: z.string().uuid().nullable().optional(),
  relatedOfferId: z.string().uuid().nullable().optional(),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  renewalType: z.enum(['None', 'Manual', 'AutoRenew']),
  amount: z.number().nullable().optional(),
  currency: z.enum(['TRY', 'USD', 'EUR']).nullable().optional(),
  paymentType: z.enum(['OneTime', 'Monthly', 'Quarterly', 'Yearly', 'Custom']).nullable().optional(),
  responsibleUserId: z.string().uuid(),
  additionalResponsibleUserIds: z.string().nullable().optional(),
  reminderDaysBefore: z.number().int().nonnegative(),
  notes: z.string().nullable().optional(),
  status: z.enum([
    'Draft', 'PendingInternalApproval', 'InternallyApproved', 'Sent', 'Signed',
    'Active', 'Expired', 'Cancelled', 'Terminated',
  ]),
});
