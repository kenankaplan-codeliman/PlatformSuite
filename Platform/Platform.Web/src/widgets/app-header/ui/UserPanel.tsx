import { Avatar, Dropdown, Space, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCurrentUserQuery } from '../../../entities/user/api/useCurrentUserQuery';
import { useLogoutMutation } from '../../../features/auth-logout/api/useLogoutMutation';
import { RoutePaths } from '../../../app/router/paths';

const { Text } = Typography;

function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
}

export function UserPanel() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const currentUser = useCurrentUserQuery();
  const logout = useLogoutMutation();

  const displayName = currentUser.data?.displayName ?? '';
  const email = currentUser.data?.email ?? '';

  const handleLogout = async () => {
    await logout.mutateAsync();
    navigate(RoutePaths.Login, { replace: true });
  };

  const items: MenuProps['items'] = [
    {
      key: 'info',
      label: (
        <div style={{ minWidth: 200 }}>
          <Text strong style={{ display: 'block' }}>
            {displayName || '—'}
          </Text>
          {email && (
            <Text type="secondary">
              {email}
            </Text>
          )}
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('actions.logout'),
      onClick: handleLogout,
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
      <Space style={{ cursor: 'pointer' }}>
        <Avatar size="small" icon={<UserOutlined />}>
          {getInitials(displayName)}
        </Avatar>
        <Text style={{ color: 'inherit' }}>{displayName || email || '—'}</Text>
      </Space>
    </Dropdown>
  );
}
