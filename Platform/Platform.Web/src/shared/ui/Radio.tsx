import { Radio as AntRadio } from 'antd';
import type { CSSProperties, ReactNode } from 'react';

export interface RadioOption<V extends string | number> {
  value: V;
  label?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps<V extends string | number> {
  value: V;
  options: RadioOption<V>[];
  onChange: (value: V) => void;
  direction?: 'horizontal' | 'vertical';
  disabled?: boolean;
  style?: CSSProperties;
}

/**
 * shared/ui — antd Radio.Group wrapper'ı.
 * Tipli `value`/`onChange` ile tek-seçim grupları için kullanılır.
 */
export function RadioGroup<V extends string | number>({
  value,
  options,
  onChange,
  direction = 'vertical',
  disabled,
  style,
}: RadioGroupProps<V>) {
  return (
    <AntRadio.Group
      value={value}
      onChange={(e) => onChange(e.target.value as V)}
      disabled={disabled}
      style={{
        display: 'flex',
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        gap: 4,
        ...style,
      }}
    >
      {options.map((opt) => (
        <AntRadio key={opt.value} value={opt.value} disabled={opt.disabled}>
          {opt.label}
        </AntRadio>
      ))}
    </AntRadio.Group>
  );
}
