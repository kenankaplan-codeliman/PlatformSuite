import { ConfigProvider } from 'antd';
import trTR from 'antd/locale/tr_TR';
import type { ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider locale={trTR}>
      <QueryProvider>{children}</QueryProvider>
    </ConfigProvider>
  );
}
