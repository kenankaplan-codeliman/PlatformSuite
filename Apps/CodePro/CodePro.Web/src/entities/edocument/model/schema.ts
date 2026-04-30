import { z } from 'zod';

export const eDocumentSchema = z.object({
  id: z.string(),
  subject: z.string().min(1).max(500),
  description: z.string().nullable().optional(),
  documentType: z.string().min(1),
  status: z.enum(['Draft', 'Sent', 'PartiallyApproved', 'Approved', 'Rejected', 'Cancelled']),
  entityType: z.string().min(1).max(100),
  entityId: z.string().uuid(),
  attachmentUrl: z.string().nullable().optional(),
  routingType: z.string().nullable().optional(),
  routingGroups: z.string().nullable().optional(),
  routingPersonIds: z.string().nullable().optional(),
  routingPersonNames: z.string().nullable().optional(),
});
