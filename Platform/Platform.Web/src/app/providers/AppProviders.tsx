import { ConfigProvider } from "antd";
import trTR from "antd/locale/tr_TR";
import type { ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";
import { EmptyState } from "../../shared/ui/feedback/EmptyState";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      locale={trTR}
      renderEmpty={(componentName) => (
        <EmptyState size={componentName === "Select" ? "small" : "default"} />
      )}
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
