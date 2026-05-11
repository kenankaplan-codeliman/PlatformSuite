import { Typography as AntTypography } from 'antd';
import type { CSSProperties, ReactNode } from 'react';

export interface TitleProps {
  children?: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5;
  style?: CSSProperties;
}

export interface TextProps {
  children?: ReactNode;
  type?: 'secondary' | 'success' | 'warning' | 'danger';
  strong?: boolean;
  italic?: boolean;
  ellipsis?: boolean;
  style?: CSSProperties;
}

/**
 * shared/ui — antd Typography.Title wrapper'ı.
 */
export function Title({ children, level = 3, style }: TitleProps) {
  return (
    <AntTypography.Title level={level} style={style}>
      {children}
    </AntTypography.Title>
  );
}

/**
 * shared/ui — antd Typography.Text wrapper'ı.
 */
export function Text({
  children,
  type,
  strong,
  italic,
  ellipsis,
  style,
}: TextProps) {
  return (
    <AntTypography.Text
      type={type}
      strong={strong}
      italic={italic}
      ellipsis={ellipsis}
      style={style}
    >
      {children}
    </AntTypography.Text>
  );
}
