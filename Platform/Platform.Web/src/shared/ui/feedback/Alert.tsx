import { Alert as AntAlert } from 'antd';
import type { ReactNode } from 'react';

export interface AlertProps {
  type: 'success' | 'info' | 'warning' | 'error';
  message: ReactNode;
  description?: ReactNode;
  closable?: boolean;
  onClose?: () => void;
  showIcon?: boolean;
  className?: string;
}

export function Alert(props: AlertProps) {
  return <AntAlert showIcon {...props} />;
}
