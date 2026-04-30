import { ConfigProvider } from "antd";
import trTR from "antd/locale/tr_TR";
import type { ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      locale={trTR}
      theme={{
        components: {
          Form: {
            labelColor: "rgba(0, 0, 0, 0.50)",
          },
        },
      }}
    >
      <QueryProvider>{children}</QueryProvider>
    </ConfigProvider>
  );
}
