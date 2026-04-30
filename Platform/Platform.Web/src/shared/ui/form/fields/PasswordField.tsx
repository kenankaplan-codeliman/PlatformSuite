import { Form, Input } from 'antd';
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { useErrorMessage } from '../../../lib/i18n/errorMessage';
import type { FormRowItemProps } from '../FormRow';

export interface PasswordFieldProps<TValues extends FieldValues> extends FormRowItemProps {
  name: FieldPath<TValues>;
  control: Control<TValues>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
}

/**
 * react-hook-form + antd Input.Password wrapper.
 */
export function PasswordField<TValues extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  required,
  disabled,
  autoComplete,
}: PasswordFieldProps<TValues>) {
  const translateError = useErrorMessage();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Form.Item
          label={label}
          required={required}
          validateStatus={fieldState.error ? 'error' : undefined}
          help={translateError(fieldState.error?.message)}
        >
          <Input.Password
            {...field}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete={autoComplete}
            value={field.value ?? ''}
          />
        </Form.Item>
      )}
    />
  );
}
