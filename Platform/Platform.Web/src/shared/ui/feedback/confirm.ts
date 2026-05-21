import { Modal } from "antd";
import type { ReactNode } from "react";

export interface ConfirmOptions {
  title?: ReactNode;
  content?: ReactNode;
  okText?: ReactNode;
  cancelText?: ReactNode;
  /** OK butonunu tehlikeli (kırmızı) gösterir — silme vb. için. */
  danger?: boolean;
  /**
   * Onaylanınca çalışır. Promise dönerse, çözülene kadar dialog açık ve OK
   * butonu loading kalır; reddedilirse dialog açık kalır.
   */
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
}

/**
 * Platform onay (confirm) dialog'u. antd `Modal.confirm`'i sarar; sayfa/widget/
 * feature kodu antd'yi doğrudan kullanmak yerine bunu çağırır.
 */
export function confirm(options: ConfirmOptions): void {
  Modal.confirm({
    title: options.title,
    content: options.content,
    okText: options.okText,
    cancelText: options.cancelText,
    okButtonProps: options.danger ? { danger: true } : undefined,
    onOk: options.onOk,
    onCancel: options.onCancel,
  });
}
