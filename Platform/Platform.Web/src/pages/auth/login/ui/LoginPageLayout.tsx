import type { ReactNode } from 'react';

export interface LoginPageLayoutProps {
  brand?: ReactNode;
  children: ReactNode;
}

/**
 * Tam ekran login layout'u — sadece bu sayfaya özel.
 */
export function LoginPageLayout({ brand, children }: LoginPageLayoutProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)',
        padding: 24,
      }}
    >
      <div style={{ width: '100%', maxWidth: 420 }}>
        {brand && (
          <div style={{ textAlign: 'center', marginBottom: 24, fontSize: 22, fontWeight: 600 }}>
            {brand}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
