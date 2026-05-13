import type { SelectOption } from '../../ui/form/fields/SelectField';

/**
 * String union sabit array'ini (örn. `['Active','Inactive'] as const`) translate fonksiyonuyla
 * birleştirip `SelectField` options dizisi üretir.
 *
 * @example
 *   const ACCOUNT_STATUSES = ['Prospect','Active','AtRisk','Inactive','Churned'] as const;
 *   const tStatus = useEnumTranslation('accountStatus');
 *   <SelectField options={enumToOptions(ACCOUNT_STATUSES, tStatus)} ... />
 */
export function enumToOptions<T extends string>(
  values: readonly T[],
  translate: (value: T) => string,
): SelectOption<T>[] {
  return values.map((value) => ({ value, label: translate(value) || value }));
}
