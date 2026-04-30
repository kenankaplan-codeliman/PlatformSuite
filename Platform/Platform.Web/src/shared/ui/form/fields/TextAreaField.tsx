import { Form, Input } from 'antd';
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import type { FormMode } from '../../../types/FormMode';
import { useFormMode } from '../useFormMode';
import { useErrorMessage } from '../../../lib/i18n/errorMessage';

export interface TextAreaFieldProps<TValues extends FieldValues> {
  name: FieldPath<TValues>;
  control: Control<TValues>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  force?: 'readonly' | 'editable';
  hideInMode?: FormMode[];
  requiredInMode?: FormMode[];
}

export function TextAreaField<TValues extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  required,
  rows = 4,
  maxLength,
  force,
  hideInMode,
  requiredInMode,
}: TextAreaFieldProps<TValues>) {
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
            <span style={{ whiteSpace: 'pre-wrap' }}>{field.value ?? '—'}</span>
          ) : (
            <Input.TextArea
              {...field}
              rows={rows}
              placeholder={placeholder}
              maxLength={maxLength}
              value={field.value ?? ''}
            />
          )}
        </Form.Item>
      )}
    />
  );
}
