import { Badge as AntBadge } from 'antd';
import type { ReactNode } from 'react';

export type BadgeStatus =
  | 'default'
  | 'processing'
  | 'success'
  | 'warning'
  | 'error';

export interface BadgeProps {
  status?: BadgeStatus;
  color?: string;
  text?: ReactNode;
  count?: number;
}

/**
 * shared/ui — antd Badge wrapper'ı.
 */
export function Badge({ status, color, text, count }: BadgeProps) {
  return <AntBadge status={status} color={color} text={text} count={count} />;
}
