import { useTranslation } from "react-i18next";

/**
 * Validation mesajları (zod, backend ValidationProblemDetails) i18n **key**'i olarak yazılır:
 *   z.string().min(1, 'common:errors.required')
 *
 * Field primitifleri bu hook ile mesajı çevirir. Key değilse olduğu gibi döner.
 */
export function useErrorMessage() {
  const { t } = useTranslation();
  return (message: string | undefined): string | undefined => {
    if (!message) return undefined;
    // i18next default ns/key ayraçlarıyla (":" / ".") key'i çözer; key değilse kendisini döner.
    return t(message, { defaultValue: message });
  };
}
