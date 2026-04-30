import { z } from 'zod';

export const budgetSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(300),
  description: z.string().nullable().optional(),
  scopeOrganizationId: z.string().uuid().nullable().optional(),
  budgetCategoryId: z.string().uuid().nullable().optional(),
  periodType: z.enum(['Yearly', 'Quarterly', 'Monthly', 'Custom']),
  startDate: z.string(),
  endDate: z.string(),
  totalAmount: z.number().nonnegative(),
  currency: z.string().min(1).max(10),
  overflowBehavior: z.enum(['Block', 'Warn', 'Free']),
  reservationReleasePoint: z.enum(['RequestApproval', 'PurchaseOrder', 'Contract', 'Invoice']),
  alertThresholdPercentage: z.number().int().min(0).max(100),
  carryOverEnabled: z.boolean(),
  responsibleUserId: z.string().uuid(),
  status: z.enum([
    'Draft', 'InInternalApproval', 'Active', 'Depleted', 'Expired', 'Passive', 'Rejected',
  ]),
});
