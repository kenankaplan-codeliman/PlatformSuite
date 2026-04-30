import { z } from 'zod';

/**
 * react-hook-form resolver'ı. Validation mesajları i18n key'lerini döner;
 * UI katmanı `useTranslation` ile çevirir.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'common:errors.required')
    .email('common:errors.invalidEmail'),
  password: z
    .string()
    .min(1, 'common:errors.required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
