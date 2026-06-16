import { useMemo } from 'react';
import { DatePicker, Form } from 'antd';
import dayjs from 'dayjs';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { FormMode } from '../../../types/FormMode';
import { useFormMode } from '../useFormMode';
import { useErrorMessage } from '../../../lib/i18n/errorMessage';
import type { FormRowItemProps } from '../FormRow';

export interface DateTimeFieldProps<TValues extends FieldValues>
  extends FormRowItemProps {
  name: FieldPath<TValues>;
  control: Control<TValues>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  /**
   * `true` ise picker'da saat seçimi de yapılır ve view modda
   * saat de gösterilir. Varsayılan `false` (sadece tarih).
   */
  showTime?: boolean;
  /** Alan seviyesinde override — context mod'unu görmezden gelir. */
  force?: 'readonly' | 'editable';
  hideInMode?: FormMode[];
  requiredInMode?: FormMode[];
}

/**
 * Mode-aware tarih/saat alanı — Client_Architecture §8.
 * - Edit/new modda: antd DatePicker (opsiyonel `showTime`).
 * - View modda: aktif i18next diline göre lokalize tarih (ve `showTime` ise saat).
 *
 * Storage: ISO 8601 string (`YYYY-MM-DD` veya `YYYY-MM-DDTHH:mm:ssZ`).
 * Backend `DateTime?` ile uyumlu; mevcut `z.string().nullish()` şemalarını bozmaz.
 */
export function DateTimeField<TValues extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  required,
  showTime = false,
  force,
  hideInMode,
  requiredInMode,
}: DateTimeFieldProps<TValues>) {
  const { mode } = useFormMode();
  const { i18n } = useTranslation();
  const translateError = useErrorMessage();

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(
        i18n.language || 'tr',
        showTime
          ? { dateStyle: 'medium', timeStyle: 'short' }
          : { dateStyle: 'medium' },
      ),
    [i18n.language, showTime],
  );

  if (hideInMode?.includes(mode)) return null;

  const isViewMode =
    force === 'readonly' || (force !== 'editable' && mode === 'view');
  const effectiveRequired = required || requiredInMode?.includes(mode);

  const pickerFormat = showTime ? 'DD.MM.YYYY HH:mm' : 'DD.MM.YYYY';

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const rawValue = field.value as string | null | undefined;
        const dateValue = rawValue ? dayjs(rawValue) : null;
        const validDate = dateValue && dateValue.isValid() ? dateValue : null;

        return (
          <Form.Item
            label={label}
            required={effectiveRequired && !isViewMode}
            validateStatus={fieldState.error ? 'error' : undefined}
            help={translateError(fieldState.error?.message)}
          >
            {isViewMode ? (
              <span style={{ color: 'rgba(0,0,0,0.85)' }}>
                {validDate ? formatter.format(validDate.toDate()) : '—'}
              </span>
            ) : (
              <DatePicker
                style={{ width: '100%' }}
                value={validDate}
                onChange={(d) => {
                  if (!d) {
                    field.onChange(null);
                    return;
                  }
                  field.onChange(
                    showTime
                      ? d.toISOString()
                      : d.format('YYYY-MM-DD'),
                  );
                }}
                onBlur={field.onBlur}
                placeholder={placeholder}
                showTime={showTime ? { format: 'HH:mm' } : false}
                format={pickerFormat}
                allowClear
              />
            )}
          </Form.Item>
        );
      }}
    />
  );
}
