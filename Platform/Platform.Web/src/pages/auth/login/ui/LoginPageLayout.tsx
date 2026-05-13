import type { ReactNode } from 'react';
// TODO: shared/ui'de Layout wrapper'ı (app-shell composition primitivi olarak) eklenince migrate et.
// eslint-disable-next-line no-restricted-imports
import { Layout } from 'antd';
import { AppHeader } from '../../../../widgets/app-header/ui/AppHeader';

export interface LoginPageLayoutProps {
  children: ReactNode;
}

/**
 * Tam ekran login layout'u — sadece bu sayfaya özel.
 * Üstte AppHeader (logo + uygulama bilgileri) görünür.
 */
export function LoginPageLayout({ children }: LoginPageLayoutProps) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)',
          padding: 24,
        }}
      >
        <div style={{ width: '100%', maxWidth: 420 }}>{children}</div>
      </div>
    </Layout>
  );
}
