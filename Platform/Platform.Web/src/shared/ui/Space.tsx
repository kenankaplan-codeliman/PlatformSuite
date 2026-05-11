import { Space as AntSpace } from 'antd';
import type { CSSProperties, ReactNode } from 'react';

export interface SpaceProps {
  children?: ReactNode;
  direction?: 'horizontal' | 'vertical';
  size?: 'small' | 'middle' | 'large' | number;
  align?: 'start' | 'end' | 'center' | 'baseline';
  wrap?: boolean;
  style?: CSSProperties;
}

/**
 * shared/ui — antd Space wrapper'ı.
 * Yatay/dikey aralıklı çocuk listesi için kullanılır.
 */
export function Space({
  children,
  direction = 'horizontal',
  size,
  align,
  wrap,
  style,
}: SpaceProps) {
  return (
    <AntSpace
      direction={direction}
      size={size}
      align={align}
      wrap={wrap}
      style={style}
    >
      {children}
    </AntSpace>
  );
}
