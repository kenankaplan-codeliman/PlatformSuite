import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, InputNumber } from 'antd';
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import type { FormMode } from '../../../types/FormMode';
import { useFormMode } from '../useFormMode';
import { useErrorMessage } from '../../../lib/i18n/errorMessage';
import type { FormRowItemProps } from '../FormRow';

/**
 * Locale-aware formatlı para tutarı input'u — binlik/ondalık ayraçları kullanıcının
 * lokaline göre (tr: 1.000,00 | en: 1,000.00).
 *
 * Yalnızca numeric tutar tutar — para birimi seçimi bu component'in kapsamı dışındadır.
 * Currency için kullanım yerinde ayrı bir SelectField (CurrencyType GeneralParameter)
 * kullanılır; deal-level vs satır-level vs entity-level semantiği o sayfa kararıdır.
 *
 * Diğer field primitifleri gibi mode'u <see cref="useFormMode"/> ile context'ten okur;
 * view modunda formatlı sayıyı salt-okunur gösterir.
 */
export interface CurrencyFieldProps<TValues extends FieldValues>
  extends FormRowItemProps {
  /** Tutar (numeric) form alanı. */
  name: FieldPath<TValues>;
  control: Control<TValues>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  precision?: number;
  force?: 'readonly' | 'editable';
  hideInMode?: FormMode[];
  requiredInMode?: FormMode[];
}

export function CurrencyField<TValues extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  required,
  min,
  max,
  precision = 2,
  force,
  hideInMode,
  requiredInMode,
}: CurrencyFieldProps<TValues>) {
  const { mode } = useFormMode();
  const { i18n } = useTranslation();
  const translateError = useErrorMessage();

  const amountCtl = useController({ name, control });

  // Lokalizasyona göre binlik/ondalık ayraçları (tr: '.' / ',', en: ',' / '.').
  const locale = i18n.language ?? 'tr';
  const { groupSep, decimalSep } = useMemo(() => {
    const parts = new Intl.NumberFormat(locale).formatToParts(11111.1);
    return {
      groupSep: parts.find((p) => p.type === 'group')?.value ?? '.',
      decimalSep: parts.find((p) => p.type === 'decimal')?.value ?? ',',
    };
  }, [locale]);

  // antd InputNumber ham değeri '.' ondalıklı string ile geçer. Tamsayı kısmını
  // binlik ayraçla grupla, ondalığı lokal ayraçla göster (yazım sırasındaki
  // sondaki ayracı korur).
  const formatAmount = (value?: string | number): string => {
    if (value === undefined || value === null || value === '') return '';
    const str = String(value);
    const negative = str.startsWith('-');
    const unsigned = negative ? str.slice(1) : str;
    const [intPart = '', decPart] = unsigned.split('.');
    const groupedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, groupSep);
    const result = decPart !== undefined ? groupedInt + decimalSep + decPart : groupedInt;
    return (negative ? '-' : '') + result;
  };

  // Görünen metni ham sayıya çevir: binlik ayraçları sil, ondalık ayracı '.' yap.
  const parseAmount = (displayValue?: string): string => {
    if (!displayValue) return '';
    let s = displayValue.split(groupSep).join('');
    if (decimalSep !== '.') s = s.split(decimalSep).join('.');
    return s.replace(/[^\d.-]/g, '');
  };

  const formatView = (v: number): string =>
    new Intl.NumberFormat(locale, {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    }).format(v);

  if (hideInMode?.includes(mode)) return null;

  const isViewMode = force === 'readonly' || (force !== 'editable' && mode === 'view');
  const effectiveRequired = required || requiredInMode?.includes(mode);

  const amountValue = amountCtl.field.value as number | null | undefined;
  const fieldError = amountCtl.fieldState.error;

  return (
    <Form.Item
      label={label}
      required={effectiveRequired && !isViewMode}
      validateStatus={fieldError ? 'error' : undefined}
      help={translateError(fieldError?.message)}
    >
      {isViewMode ? (
        <span>
          {amountValue === null || amountValue === undefined
            ? '—'
            : formatView(amountValue)}
        </span>
      ) : (
        <InputNumber
          style={{ width: '100%' }}
          placeholder={placeholder}
          min={min}
          max={max}
          precision={precision}
          formatter={formatAmount}
          parser={parseAmount}
          value={amountValue ?? null}
          onChange={(v) => amountCtl.field.onChange(v)}
          onBlur={amountCtl.field.onBlur}
        />
      )}
    </Form.Item>
  );
}
