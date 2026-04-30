import { z } from 'zod';

export const leadSourceEnum = [
  'Other',
  'Website',
  'Email',
  'Phone',
  'Referral',
  'Advertisement',
  'SocialMedia',
  'Event',
  'PartnerNetwork',
] as const;

export const leadStatusEnum = [
  'New',
  'Contacted',
  'Qualified',
  'Unqualified',
  'Converted',
] as const;

export const leadSchema = z.object({
  id: z.string(),
  subject: z.string().min(1, 'common:errors.required').max(250),
  firstName: z.string().max(100).nullish(),
  lastName: z.string().max(100).nullish(),
  company: z.string().max(250).nullish(),
  title: z.string().max(150).nullish(),
  email: z
    .string()
    .max(250)
    .nullish()
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: 'common:errors.invalidEmail',
    }),
  phone: z.string().max(50).nullish(),
  website: z.string().max(250).nullish(),
  source: z.enum(leadSourceEnum),
  status: z.enum(leadStatusEnum),
  score: z.number().int().min(0).max(100).nullish(),
  estimatedValue: z.number().min(0).nullish(),
  description: z.string().nullish(),
  convertedAccountId: z.string().nullish(),
  convertedContactId: z.string().nullish(),
  isActive: z.boolean(),
});
