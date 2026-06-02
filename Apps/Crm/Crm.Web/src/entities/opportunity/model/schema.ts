import { z } from 'zod';
import { entityReferenceSchema } from '@platform/ui';

// Para birimi parent opportunity.currency'den gelir — satır-seviyesi currency yok.
// unitCode: GeneralParameter code (parentCode: ProductUnitOfMeasure). Ürün seçilince
// prefill edilir; satırda override edilebilir. Geçerli code doğrulaması backend'de.
// discountRate (0-100) + discountAmount (>=0): önce oran sonra tutar uygulanır;
// netAmount = max(0, lineTotal − lineTotal × discountRate/100 − discountAmount).
export const opportunityProductModalSchema = z.object({
  id: z.string(),
  product: entityReferenceSchema.nullish().refine((v) => !!v && !!v.id, {
    message: 'common:errors.required',
  }),
  quantity: z.number().positive(),
  unitPrice: z.number().min(0),
  unitCode: z.string().max(50).nullish(),
  discountRate: z.number().min(0).max(100),
  discountAmount: z.number().min(0),
  lineTotal: z.number().optional(),
  netAmount: z.number().optional(),
});

// stage GeneralParameter'a taşındı — statik z.enum yerine z.string().
// Geçerli code doğrulaması backend handler'ında (IGeneralParameterReader) yapılır.
export const opportunitySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'common:errors.required').max(250),
  description: z.string().nullish(),
  account: entityReferenceSchema.nullish(),
  primaryContact: entityReferenceSchema.nullish(),
  stage: z.string().min(1, 'common:errors.required'),
  estimatedAmount: z.number().min(0).nullish(),
  // Deal-level para birimi (CurrencyType code). Backend: EstimatedAmount veya Products
  // varsa zorunlu; geçerli code kontrolü handler'da.
  currency: z.string().nullish(),
  // Sunucu hesaplar (Products toplamı); form'da read-only display.
  actualAmount: z.number().nullish(),
  actualNetAmount: z.number().nullish(),
  totalDiscountAmount: z.number().nullish(),
  totalDiscountRate: z.number().nullish(),
  probability: z.number().int().min(0).max(100),
  closeDate: z.string().nullish(),
  lossReason: z.string().max(500).nullish(),
  products: z.array(opportunityProductModalSchema),
  isActive: z.boolean(),
});
