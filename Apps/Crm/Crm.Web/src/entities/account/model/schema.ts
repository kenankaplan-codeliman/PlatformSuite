import { z } from 'zod';
import { entityReferenceSchema } from '@platform/ui';

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
  countryCode: z.string().nullish(),
  countryName: z.string().nullish(),
  cityCode: z.string().nullish(),
  cityName: z.string().nullish(),
  districtCode: z.string().nullish(),
  districtName: z.string().nullish(),
  state: z.string().nullish(),
  postalCode: z.string().nullish(),
  type: z.enum(['Billing', 'Shipping', 'Office', 'Other']),
  isPrimary: z.boolean(),
});

const accountContactModalSchema = z.object({
  id: z.string(),
  contactId: z.string().min(1, 'common:errors.required'),
  contactName: z.string().nullish(),
  role: z.string().nullish(),
  isPrimary: z.boolean(),
});

export const accountSchema = z.object({
  id: z.string(),
  accountName: z.string().min(1, 'common:errors.required').max(200),
  // accountType / accountStatus GeneralParameter'a taşındı — statik z.enum yerine z.string().
  // Geçerli code doğrulaması backend handler'ında (IGeneralParameterReader) yapılır.
  accountType: z.string().min(1, 'common:errors.required'),
  accountStatus: z.string().min(1, 'common:errors.required'),
  industry: z.string().max(200).nullish(),
  annualRevenue: z.number().min(0).nullish(),
  numberOfEmployees: z.number().int().min(0).nullish(),
  website: z.string().max(500).nullish(),
  description: z.string().nullish(),
  parentAccount: entityReferenceSchema.nullish(),
  emails: z.array(emailModalSchema),
  phones: z.array(phoneModalSchema),
  addresses: z.array(addressModalSchema),
  contacts: z.array(accountContactModalSchema),
  isActive: z.boolean(),
});
