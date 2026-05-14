import { z } from 'zod';

/**
 * Client_Architecture: zod şeması + rhf resolver. Validation mesajları i18n key'i olarak yazılır,
 * UI katmanında `useTranslation` ile çevrilir.
 */

const emailModalSchema = z.object({
  id: z.string(),
  email: z.string().min(1, 'common:errors.required').email('common:errors.invalidEmail'),
  type: z.enum(['Work', 'Personal', 'Billing', 'Support', 'Other']),
  isPrimary: z.boolean(),
});

const phoneModalSchema = z.object({
  id: z.string(),
  phoneNumber: z.string().min(1, 'common:errors.required'),
  type: z.enum(['Mobile', 'Work', 'Home', 'Fax', 'Other']),
  isPrimary: z.boolean(),
});

const addressModalSchema = z.object({
  id: z.string().optional(),
  addressLine1: z.string().min(1, 'common:errors.required'),
  addressLine2: z.string().nullish(),
  city: z.string().nullish(),
  state: z.string().nullish(),
  postalCode: z.string().nullish(),
  country: z.string().nullish(),
  type: z.enum(['Billing', 'Shipping', 'Office', 'Other']),
  isPrimary: z.boolean(),
});

const contactAccountModalSchema = z.object({
  id: z.string(),
  accountId: z.string().min(1, 'common:errors.required'),
  accountName: z.string().nullish(),
  role: z.string().nullish(),
  isPrimary: z.boolean(),
});

export const contactSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1, 'common:errors.required').max(100),
  lastName: z.string().min(1, 'common:errors.required').max(100),
  contactStatus: z.string().min(1, 'common:errors.required'),
  title: z.string().max(200).nullish(),
  department: z.string().max(200).nullish(),
  birthDate: z.string().nullish(),
  description: z.string().nullish(),
  accountContacts: z.array(contactAccountModalSchema),
  emails: z.array(emailModalSchema),
  phones: z.array(phoneModalSchema),
  addresses: z.array(addressModalSchema),
  isActive: z.boolean(),
});
