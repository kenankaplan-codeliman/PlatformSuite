import { Dropdown as AntDropdown, type DropdownProps as AntDropdownProps } from 'antd';
import type { ReactElement } from 'react';

export interface DropdownItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface DropdownProps {
  items: DropdownItem[];
  children: ReactElement;
  trigger?: AntDropdownProps['trigger'];
  placement?: AntDropdownProps['placement'];
  disabled?: boolean;
}

/**
 * antd Dropdown'u sayfa/feature katmanlarına açan thin wrapper.
 * Tek kullanım kalıbı: tıklanabilir menü tetikleyicisi.
 */
export function Dropdown({
  items,
  children,
  trigger = ['click'],
  placement,
  disabled,
}: DropdownProps) {
  return (
    <AntDropdown
      menu={{
        items: items.map((item) => ({
          key: item.key,
          label: item.label,
          icon: item.icon,
          danger: item.danger,
          disabled: item.disabled,
          onClick: () => item.onClick?.(),
        })),
      }}
      trigger={trigger}
      placement={placement}
      disabled={disabled}
    >
      {children}
    </AntDropdown>
  );
}
