import { Button as AntButton, type ButtonProps as AntButtonProps } from 'antd';
import type { ReactNode } from 'react';

export interface ButtonProps {
  children?: ReactNode;
  onClick?: AntButtonProps['onClick'];
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  htmlType?: AntButtonProps['htmlType'];
  danger?: boolean;
  loading?: boolean;
  disabled?: boolean;
  block?: boolean;
  size?: 'small' | 'middle' | 'large';
  icon?: ReactNode;
  'aria-label'?: string;
}

/**
 * Uygulamanın standart buton primitifi.
 * `shared/ui` dışında `antd` Button'u doğrudan kullanılmaz.
 */
export function Button({ type = 'default', ...rest }: ButtonProps) {
  return <AntButton type={type} {...rest} />;
}
