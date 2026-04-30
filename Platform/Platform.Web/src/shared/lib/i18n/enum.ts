import { useTranslation } from "react-i18next";

/**
 * Enum değerlerini `shared/locales/enums/<lang>.json` dosyasından çevirir.
 *
 * @example
 *   const tStatus = useEnumTranslation('accountStatus');
 *   <Tag>{tStatus(account.status)}</Tag>  // "Active" → "Aktif"
 */
export function useEnumTranslation(enumName: string) {
  const { t } = useTranslation("enums");
  return (value: string | null | undefined): string => {
    if (!value) return "";
    return t(`${enumName}.${value}`, { defaultValue: value });
  };
}
