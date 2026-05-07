import { useState, type ReactNode } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { AppHeader } from '../../app-header/ui/AppHeader';
import { AppSidebar } from '../../app-sidebar/ui/AppSidebar';
import type { MenuSchema } from '../../app-sidebar/model/types';

const { Content } = Layout;

export interface AppShellProps {
  menu: MenuSchema;
  headerExtra?: ReactNode;
}

export function AppShell({ menu, headerExtra }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      <AppHeader extra={headerExtra} />
      <Layout style={{ flex: 1, minHeight: 0 }}>
        <AppSidebar items={menu} collapsed={collapsed} onCollapse={setCollapsed} />
        <Content style={{ overflow: 'auto', background: '#f5f5f5', padding: 16 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
