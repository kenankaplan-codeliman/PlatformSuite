import { Checkbox, Form, Tag } from 'antd';
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { FormMode } from '../../../types/FormMode';
import { useFormMode } from '../useFormMode';
import type { FormRowItemProps } from '../FormRow';

export interface CheckboxFieldProps<TValues extends FieldValues> extends FormRowItemProps {
  name: FieldPath<TValues>;
  control: Control<TValues>;
  label?: string;
  /** Checkbox yanında gösterilen metin (label dışındaki açıklama). */
  text?: string;
  force?: 'readonly' | 'editable';
  hideInMode?: FormMode[];
}

/**
 * Mode-aware boolean field. View modda Tag olarak render eder.
 */
export function CheckboxField<TValues extends FieldValues>({
  name,
  control,
  label,
  text,
  force,
  hideInMode,
}: CheckboxFieldProps<TValues>) {
  const { mode } = useFormMode();
  const { t } = useTranslation('common');

  if (hideInMode?.includes(mode)) return null;

  const isViewMode = force === 'readonly' || (force !== 'editable' && mode === 'view');

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const checked = !!field.value;
        return (
          <Form.Item label={label}>
            {isViewMode ? (
              <Tag color={checked ? 'blue' : 'default'}>
                {checked ? t('actions.yes', { defaultValue: 'Evet' }) : t('actions.no', { defaultValue: 'Hayır' })}
              </Tag>
            ) : (
              <Checkbox
                checked={checked}
                onChange={(e) => field.onChange(e.target.checked)}
              >
                {text}
              </Checkbox>
            )}
          </Form.Item>
        );
      }}
    />
  );
}
