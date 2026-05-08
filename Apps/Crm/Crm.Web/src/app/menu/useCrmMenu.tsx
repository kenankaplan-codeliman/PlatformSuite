import { useTranslation } from 'react-i18next';
import {
  HomeOutlined,
  RiseOutlined,
  FundOutlined,
  TeamOutlined,
  UserOutlined,
  SafetyOutlined,
  SettingOutlined,
  ContactsOutlined,
  CalendarOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import type { MenuSchema } from '@platform/ui';
import { RoutePaths } from '../router/paths';

export function useCrmMenu(): MenuSchema {
  const { t } = useTranslation('app.crm-menu');
  return [
    { key: 'home', label: t('home'), icon: <HomeOutlined />, to: RoutePaths.Home },
    {
      key: 'sales',
      label: t('groups.sales'),
      icon: <RiseOutlined />,
      children: [
        { key: 'leads', label: t('leads'), icon: <ContactsOutlined />, to: RoutePaths.LeadsList },
        { key: 'opportunities', label: t('opportunities'), icon: <FundOutlined />, to: RoutePaths.OpportunitiesList },
      ],
    },
    {
      key: 'customers',
      label: t('groups.customers'),
      icon: <AppstoreOutlined />,
      children: [
        { key: 'accounts', label: t('accounts'), icon: <TeamOutlined />, to: RoutePaths.AccountsList },
        { key: 'contacts', label: t('contacts'), icon: <UserOutlined />, to: RoutePaths.ContactsList },
        { key: 'activities', label: t('activities'), icon: <CalendarOutlined />, to: RoutePaths.ActivitiesList },
      ],
    },
    {
      key: 'settings',
      label: t('groups.settings'),
      icon: <SettingOutlined />,
      children: [
        { key: 'users', label: t('users'), icon: <UserOutlined />, to: RoutePaths.AppUsersList },
        { key: 'roles', label: t('roles'), icon: <SafetyOutlined />, to: RoutePaths.AppRolesList },
      ],
    },
  ];
}
