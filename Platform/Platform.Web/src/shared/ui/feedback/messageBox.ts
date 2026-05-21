import { message } from "antd";
import type { ReactNode } from "react";

/**
 * Platform bildirim (toast) yardımcısı. antd `message`'i sarar; sayfa/widget/
 * feature kodu antd'yi doğrudan kullanmak yerine bunu çağırır.
 */
export const messageBox = {
  success: (content: ReactNode) => message.success(content),
  error: (content: ReactNode) => message.error(content),
  info: (content: ReactNode) => message.info(content),
  warning: (content: ReactNode) => message.warning(content),
} as const;
