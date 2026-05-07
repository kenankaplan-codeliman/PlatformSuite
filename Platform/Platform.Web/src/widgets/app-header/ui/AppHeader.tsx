import type { ReactNode } from 'react';
import { Layout, Flex } from 'antd';
import { useAppMeta } from '../../../shared/lib/app-meta/AppMetaContext';
import { useSessionStore } from '../../../shared/lib/auth/sessionStore';
import { UserPanel } from './UserPanel';

const { Header } = Layout;

export interface AppHeaderProps {
  extra?: ReactNode;
}

export function AppHeader({ extra }: AppHeaderProps) {
  const { logo, appName, appDescription } = useAppMeta();
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const showText = Boolean(appName || appDescription);

  return (
    <Header
      style={{
        background: '#001529',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingInline: 24,
        height: 56,
        lineHeight: 1.2,
      }}
    >
      <Flex align="center" gap={12}>
        {logo && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.25)',
              lineHeight: 0,
            }}
          >
            {logo}
          </span>
        )}
        {showText && (
          <Flex vertical justify="center">
            {appName && (
              <span style={{ color: '#fff', fontSize: 20, fontWeight: 600, lineHeight: 1.2 }}>
                {appName}
              </span>
            )}
            {appDescription && (
              <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10, lineHeight: 1.2 }}>
                {appDescription}
              </span>
            )}
          </Flex>
        )}
      </Flex>
      <Flex align="center" gap={16} style={{ color: '#fff' }}>
        {extra}
        {isAuthenticated && <UserPanel />}
      </Flex>
    </Header>
  );
}
