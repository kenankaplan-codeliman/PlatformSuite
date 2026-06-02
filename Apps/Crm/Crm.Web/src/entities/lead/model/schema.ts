import { z } from 'zod';

// source / status GeneralParameter'a taşındı — statik z.enum yerine z.string().
// Geçerli code doğrulaması backend handler'ında (IGeneralParameterReader) yapılır.
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
  source: z.string().min(1, 'common:errors.required'),
  status: z.string().min(1, 'common:errors.required'),
  score: z.number().int().min(0).max(100).nullish(),
  estimatedValue: z.number().min(0).nullish(),
  // Para birimi: GeneralParameter code (CurrencyType). Geçerlilik backend handler'ında.
  estimatedValueCurrency: z.string().nullish(),
  description: z.string().nullish(),
  convertedAccountId: z.string().nullish(),
  convertedContactId: z.string().nullish(),
  isActive: z.boolean(),
});
