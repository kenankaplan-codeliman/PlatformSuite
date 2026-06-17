import { Modal as AntModal } from 'antd';
import type { CSSProperties, ReactNode } from 'react';

export interface ModalProps {
  open: boolean;
  title?: ReactNode;
  children?: ReactNode;
  okText?: ReactNode;
  cancelText?: ReactNode;
  onOk?: () => void;
  onCancel?: () => void;
  confirmLoading?: boolean;
  /** Kapanınca içerik DOM'dan kaldırılsın mı (form state reset için). */
  destroyOnHidden?: boolean;
  width?: number | string;
  style?: CSSProperties;
}

/**
 * shared/ui — antd Modal wrapper'ı.
 * Feature dialog'ları (örn. Lead Convert) bu primitifi kullanır.
 */
export function Modal({
  open,
  title,
  children,
  okText,
  cancelText,
  onOk,
  onCancel,
  confirmLoading,
  destroyOnHidden,
  width,
  style,
}: ModalProps) {
  return (
    <AntModal
      open={open}
      title={title}
      okText={okText}
      cancelText={cancelText}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      destroyOnHidden={destroyOnHidden}
      width={width}
      style={style}
    >
      {children}
    </AntModal>
  );
}
