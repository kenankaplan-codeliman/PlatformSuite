import type { ReactNode } from 'react';
import { Layout, Space, Typography } from 'antd';
import { UserPanel } from './UserPanel';

const { Header } = Layout;
const { Text } = Typography;

export interface AppHeaderProps {
  logo?: ReactNode;
  brand?: string;
  extra?: ReactNode;
}

export function AppHeader({ logo, brand, extra }: AppHeaderProps) {
  return (
    <Header
      style={{
        background: '#001529',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingInline: 24,
        height: 56,
        lineHeight: '56px',
      }}
    >
      <Space size={12}>
        {logo}
        {brand && (
          <Text strong style={{ color: '#fff', fontSize: 16 }}>
            {brand}
          </Text>
        )}
      </Space>
      <Space size={16} style={{ color: '#fff' }}>
        {extra}
        <UserPanel />
      </Space>
    </Header>
  );
}
