import { Checkbox as AntCheckbox } from 'antd';
import type { ReactNode } from 'react';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children?: ReactNode;
  disabled?: boolean;
}

/**
 * shared/ui — antd Checkbox wrapper'ı (form'a bağlı olmayan, kontrollü kullanım).
 * Form alanı için `CheckboxField` kullanılır; bu primitif serbest UI içindir.
 */
export function Checkbox({ checked, onChange, children, disabled }: CheckboxProps) {
  return (
    <AntCheckbox
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
    >
      {children}
    </AntCheckbox>
  );
}
