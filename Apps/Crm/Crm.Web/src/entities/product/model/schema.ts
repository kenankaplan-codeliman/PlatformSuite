import { z } from 'zod';

// category / unitOfMeasure / unitPriceCurrency GeneralParameter code'u — z.string().
// Geçerli code doğrulaması backend handler'ında (IGeneralParameterReader) yapılır.
export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'common:errors.required').max(250),
  productCode: z.string().min(1, 'common:errors.required').max(50),
  category: z.string().nullish(),
  unitPrice: z.number().min(0).nullish(),
  unitPriceCurrency: z.string().nullish(),
  unitOfMeasure: z.string().nullish(),
  description: z.string().nullish(),
  isActive: z.boolean(),
});
