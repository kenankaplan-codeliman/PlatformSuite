import { Form, Switch } from 'antd';
import type { CSSProperties } from 'react';
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import type { FormMode } from '../../../types/FormMode';
import { useFormMode } from '../useFormMode';
import type { FormRowItemProps } from '../FormRow';

export interface SwitchFieldProps<TValues extends FieldValues> extends FormRowItemProps {
  name: FieldPath<TValues>;
  control: Control<TValues>;
  label?: string;
  /** Switch yanında gösterilen açıklama metni (label dışında). */
  text?: string;
  force?: 'readonly' | 'editable';
  hideInMode?: FormMode[];
  /** Form.Item'a uygulanan ek stil (örn. başlık içinde kompakt için marginBottom: 0). */
  style?: CSSProperties;
}

/**
 * Ant Design Switch tabanlı mode-aware boolean field.
 * View modda Switch görünür kalır ama disabled olur.
 */
export function SwitchField<TValues extends FieldValues>({
  name,
  control,
  label,
  text,
  force,
  hideInMode,
  style,
}: SwitchFieldProps<TValues>) {
  const { mode } = useFormMode();

  if (hideInMode?.includes(mode)) return null;

  const isViewMode = force === 'readonly' || (force !== 'editable' && mode === 'view');

  // View modunda etiketi gizle; component'in kendisi disabled olarak görünür.
  const effectiveLabel = isViewMode ? undefined : label;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Form.Item label={effectiveLabel} style={style}>
          <Switch
            checked={!!field.value}
            disabled={isViewMode}
            onChange={(checked) => field.onChange(checked)}
          />
          {text ? <span style={{ marginInlineStart: 8 }}>{text}</span> : null}
        </Form.Item>
      )}
    />
  );
}
