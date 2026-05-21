import { ConfigProvider } from "antd";
import trTR from "antd/locale/tr_TR";
import type { ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";
import { EmptyState } from "../../shared/ui/feedback/EmptyState";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      locale={trTR}
      renderEmpty={() => <EmptyState />}
      theme={{
        components: {
          Form: {
            labelColor: "rgba(0, 0, 0, 0.50)",
          },
          Table: {
            // Liste satırı hover'ı — sayfa arka planı (#f5f5f5 gri) ile kaynaşmaması
            // için nötr gri yerine hafif mavi tint; "tıklanabilir" hissi verir ve
            // lookup popup satır hover'ıyla aynı tondur.
            rowHoverBg: "#e6f4ff",
          },
        },
      }}
    >
      <QueryProvider>{children}</QueryProvider>
    </ConfigProvider>
  );
}
