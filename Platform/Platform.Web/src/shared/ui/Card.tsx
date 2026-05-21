import { Card as AntCard } from 'antd';
import type { ReactNode } from 'react';

export interface CardProps {
  title?: ReactNode;
  extra?: ReactNode;
  children?: ReactNode;
  bordered?: boolean;
  size?: 'default' | 'small';
  className?: string;
  style?: React.CSSProperties;
}

export function Card({ title, extra, children, bordered = true, size, className, style }: CardProps) {
  return (
    <AntCard title={title} extra={extra} bordered={bordered} size={size} className={className} style={style}>
      {children}
    </AntCard>
  );
}
