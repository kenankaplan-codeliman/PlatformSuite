import { Flex as AntFlex } from 'antd';
import type { CSSProperties, ReactNode } from 'react';

export interface FlexProps {
  children?: ReactNode;
  vertical?: boolean;
  gap?: number | 'small' | 'middle' | 'large';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  justify?:
    | 'start'
    | 'end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  wrap?: boolean;
  style?: CSSProperties;
}

/**
 * shared/ui — antd Flex wrapper'ı.
 */
export function Flex({
  children,
  vertical,
  gap,
  align,
  justify,
  wrap,
  style,
}: FlexProps) {
  return (
    <AntFlex
      vertical={vertical}
      gap={gap}
      align={align}
      justify={justify}
      wrap={wrap}
      style={style}
    >
      {children}
    </AntFlex>
  );
}
