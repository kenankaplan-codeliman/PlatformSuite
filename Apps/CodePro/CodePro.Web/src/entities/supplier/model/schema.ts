import { z } from 'zod';

export const supplierSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'common:errors.required').max(200),
  industry: z.string().max(120).nullable().optional(),
  website: z.string().max(255).nullable().optional(),
  description: z.string().nullable().optional(),
  annualRevenue: z.number().min(0).nullable().optional(),
  numberOfEmployees: z.number().int().min(0).nullable().optional(),

  // supplierType / supplierStatus / companyType / companyLegalType GeneralParameter'a
  // taşındı — statik z.enum yerine z.string(). Geçerli code doğrulaması backend
  // handler'ında (IGeneralParameterReader) yapılır.
  supplierType: z.string().min(1, 'common:errors.required'),
  supplierStatus: z.string().min(1, 'common:errors.required'),
  companyType: z.string().min(1, 'common:errors.required'),
  companyLegalType: z.string().nullable().optional(),
  taxOffice: z.string().max(150).nullable().optional(),
  vkn: z.string().max(20).nullable().optional(),
  mersisNo: z.string().max(20).nullable().optional(),

  contactPersonName: z.string().max(150).nullable().optional(),
  contactPersonEmail: z.string().max(255).email().nullable().optional().or(z.literal('')),
  contactPersonPhone: z.string().max(50).nullable().optional(),

  addressLine: z.string().max(500).nullable().optional(),
  city: z.string().max(120).nullable().optional(),
  country: z.string().max(120).nullable().optional(),
  postalCode: z.string().max(20).nullable().optional(),

  isActive: z.boolean(),
});
