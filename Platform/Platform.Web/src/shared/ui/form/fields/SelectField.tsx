import { Form, Select } from 'antd';
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import type { FormMode } from '../../../types/FormMode';
import { useFormMode } from '../useFormMode';
import { useErrorMessage } from '../../../lib/i18n/errorMessage';
import type { FormRowItemProps } from '../FormRow';

export interface SelectOption<TValue extends string | number = string> {
  value: TValue;
  label: string;
}

export interface SelectFieldProps<TValues extends FieldValues, TValue extends string | number = string> extends FormRowItemProps {
  name: FieldPath<TValues>;
  control: Control<TValues>;
  options: SelectOption<TValue>[];
  label?: string;
  placeholder?: string;
  required?: boolean;
  allowClear?: boolean;
  force?: 'readonly' | 'editable';
  hideInMode?: FormMode[];
  requiredInMode?: FormMode[];
}

export function SelectField<TValues extends FieldValues, TValue extends string | number = string>({
  name,
  control,
  options,
  label,
  placeholder,
  required,
  allowClear,
  force,
  hideInMode,
  requiredInMode,
}: SelectFieldProps<TValues, TValue>) {
  const { mode } = useFormMode();
  const translateError = useErrorMessage();

  if (hideInMode?.includes(mode)) return null;

  const isViewMode = force === 'readonly' || (force !== 'editable' && mode === 'view');
  const effectiveRequired = required || requiredInMode?.includes(mode);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const currentLabel = options.find((o) => o.value === field.value)?.label;
        return (
          <Form.Item
            label={label}
            required={effectiveRequired && !isViewMode}
            validateStatus={fieldState.error ? 'error' : undefined}
            help={translateError(fieldState.error?.message)}
          >
            {isViewMode ? (
              <span>{currentLabel ?? '—'}</span>
            ) : (
              <Select
                {...field}
                options={options}
                placeholder={placeholder}
                allowClear={allowClear}
                value={(field.value as TValue | undefined) ?? undefined}
              />
            )}
          </Form.Item>
        );
      }}
    />
  );
}
