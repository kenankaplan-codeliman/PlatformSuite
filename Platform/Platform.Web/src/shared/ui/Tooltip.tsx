import { Tooltip as AntTooltip } from 'antd';
import type { ReactNode } from 'react';

export interface TooltipProps {
  title: ReactNode;
  children: ReactNode;
  placement?:
    | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight';
}

/**
 * shared/ui — antd Tooltip wrapper'ı.
 */
export function Tooltip({ title, children, placement = 'top' }: TooltipProps) {
  return (
    <AntTooltip title={title} placement={placement}>
      {children}
    </AntTooltip>
  );
}
