import { Form, Input } from 'antd';
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import type { FormMode } from '../../../types/FormMode';
import { useFormMode } from '../useFormMode';
import { useErrorMessage } from '../../../lib/i18n/errorMessage';
import type { FormRowItemProps } from '../FormRow';

export interface TextFieldProps<TValues extends FieldValues> extends FormRowItemProps {
  name: FieldPath<TValues>;
  control: Control<TValues>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  maxLength?: number;
  /** Alan seviyesinde override — belirtilirse context mod'u görmezden gelinir. */
  force?: 'readonly' | 'editable';
  /** Bu modlarda field tamamen gizlenir. */
  hideInMode?: FormMode[];
  /** Bu modlarda field zorunlu olur. */
  requiredInMode?: FormMode[];
}

/**
 * Mode-aware text field primitifi — Client_Architecture §8.
 * Display (view) modda salt-okunur metin olarak render eder.
 */
export function TextField<TValues extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  required,
  autoFocus,
  autoComplete,
  maxLength,
  force,
  hideInMode,
  requiredInMode,
}: TextFieldProps<TValues>) {
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
            <span style={{ color: 'rgba(0,0,0,0.85)' }}>{field.value ?? '—'}</span>
          ) : (
            <Input
              {...field}
              placeholder={placeholder}
              autoFocus={autoFocus}
              autoComplete={autoComplete}
              maxLength={maxLength}
              value={field.value ?? ''}
            />
          )}
        </Form.Item>
      )}
    />
  );
}
