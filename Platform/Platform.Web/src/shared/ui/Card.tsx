import { Card as AntCard, type CardProps as AntCardProps } from 'antd';
import type { ReactNode } from 'react';

export interface CardProps {
  title?: ReactNode;
  extra?: ReactNode;
  children?: ReactNode;
  bordered?: boolean;
  size?: 'default' | 'small';
  className?: string;
  style?: React.CSSProperties;
  /** antd Card slot stilleri (örn. header arka planı). */
  styles?: AntCardProps['styles'];
}

export function Card({ title, extra, children, bordered = true, size, className, style, styles }: CardProps) {
  return (
    <AntCard
      title={title}
      extra={extra}
      bordered={bordered}
      size={size}
      className={className}
      style={style}
      styles={styles}
    >
      {children}
    </AntCard>
  );
}
