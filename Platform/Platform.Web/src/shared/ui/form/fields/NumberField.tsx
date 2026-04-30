import { Form, InputNumber } from 'antd';
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import type { FormMode } from '../../../types/FormMode';
import { useFormMode } from '../useFormMode';
import { useErrorMessage } from '../../../lib/i18n/errorMessage';
import type { FormRowItemProps } from '../FormRow';

export interface NumberFieldProps<TValues extends FieldValues> extends FormRowItemProps {
  name: FieldPath<TValues>;
  control: Control<TValues>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  force?: 'readonly' | 'editable';
  hideInMode?: FormMode[];
  requiredInMode?: FormMode[];
}

export function NumberField<TValues extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  required,
  min,
  max,
  step,
  precision,
  force,
  hideInMode,
  requiredInMode,
}: NumberFieldProps<TValues>) {
  const { mode } = useFormMode();
  const translateError = useErrorMessage();

  if (hideInMode?.includes(mode)) return null;

  const isViewMode = force === 'readonly' || (force !== 'editable' && mode === 'view');
  const effectiveRequired = required || requiredInMode?.includes(mode);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Form.Item
          label={label}
          required={effectiveRequired && !isViewMode}
          validateStatus={fieldState.error ? 'error' : undefined}
          help={translateError(fieldState.error?.message)}
        >
          {isViewMode ? (
            <span>{field.value ?? '—'}</span>
          ) : (
            <InputNumber
              {...field}
              style={{ width: '100%' }}
              placeholder={placeholder}
              min={min}
              max={max}
              step={step}
              precision={precision}
              value={field.value ?? null}
            />
          )}
        </Form.Item>
      )}
    />
  );
}
