import { Segmented as AntSegmented } from 'antd';
import type { ReactNode } from 'react';

export interface SegmentedOption<V extends string | number> {
  value: V;
  label?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SegmentedProps<V extends string | number> {
  value: V;
  options: SegmentedOption<V>[];
  onChange: (value: V) => void;
  size?: 'small' | 'middle' | 'large';
  disabled?: boolean;
  block?: boolean;
}

/**
 * shared/ui — antd Segmented wrapper'ı.
 * Tipli `value`/`onChange` üzerinden view-switcher gibi kullanımları çağırır.
 */
export function Segmented<V extends string | number>({
  value,
  options,
  onChange,
  size,
  disabled,
  block,
}: SegmentedProps<V>) {
  return (
    <AntSegmented
      value={value}
      options={options as never}
      onChange={(v) => onChange(v as V)}
      size={size}
      disabled={disabled}
      block={block}
    />
  );
}
