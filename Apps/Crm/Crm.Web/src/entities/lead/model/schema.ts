import { z } from 'zod';

// source / status / rating GeneralParameter'a taşındı — statik z.enum yerine z.string().
// Geçerli code doğrulaması backend handler'ında (IGeneralParameterReader) yapılır.

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

export const leadSchema = z.object({
  id: z.string(),
  subject: z.string().min(1, 'common:errors.required').max(250),
  firstName: z.string().max(100).nullish(),
  lastName: z.string().max(100).nullish(),
  title: z.string().max(150).nullish(),
  department: z.string().max(200).nullish(),
  company: z.string().max(250).nullish(),
  industry: z.string().max(150).nullish(),
  website: z.string().max(250).nullish(),
  source: z.string().min(1, 'common:errors.required'),
  status: z.string().min(1, 'common:errors.required'),
  rating: z.string().nullish(),
  score: z.number().int().min(0).max(100).nullish(),
  estimatedValue: z.number().min(0).nullish(),
  // Para birimi: GeneralParameter code (CurrencyType). Geçerlilik backend handler'ında.
  estimatedValueCurrency: z.string().nullish(),
  description: z.string().nullish(),
  emails: z.array(emailModalSchema),
  phones: z.array(phoneModalSchema),
  addresses: z.array(addressModalSchema),
  convertedAccountId: z.string().nullish(),
  convertedContactId: z.string().nullish(),
  isActive: z.boolean(),
});
