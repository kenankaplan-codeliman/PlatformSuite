import { Spin } from 'antd';
import type { ReactNode } from 'react';

export interface SpinnerProps {
  spinning?: boolean;
  tip?: string;
  size?: 'small' | 'default' | 'large';
  children?: ReactNode;
}

export function Spinner({ spinning = true, tip, size = 'default', children }: SpinnerProps) {
  if (children) {
    return (
      <Spin spinning={spinning} tip={tip} size={size}>
        {children}
      </Spin>
    );
  }
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: 160,
      }}
    >
      <Spin spinning={spinning} tip={tip} size={size} />
    </div>
  );
}
