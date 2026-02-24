import {
  MailOutlined, PhoneOutlined, CheckSquareOutlined, CalendarOutlined,
  ScheduleOutlined, RocketOutlined, UserOutlined, ContactsOutlined,
  EllipsisOutlined, DashboardOutlined, BankOutlined,
  SettingOutlined, BarChartOutlined,
  CrownOutlined, ShoppingOutlined, AppstoreOutlined,
} from '@ant-design/icons';

import { EntityType, type EntityTypeValue } from '@/types/entity.lookup.types';

export const EntityTypeConfig: Record<EntityTypeValue, { label: string; icon: React.ReactNode; color: string }> = {
  [EntityType.User]: {
    label: 'Kullanıcı',
    icon: <UserOutlined />,
    color: '#1890ff',
  },
  [EntityType.Account]: {
    label: 'Firma',
    icon: <BankOutlined />,
    color: '#52c41a',
  },
  [EntityType.Contact]: {
    label: 'Kişi',
    icon: <ContactsOutlined />,
    color: '#722ed1',
  },
  [EntityType.Lead]: {
    label: 'Aday Müşteri',
    icon: <RocketOutlined />,
    color: '#fa8c16',
  },
  [EntityType.Product]: {
    label: 'Ürün',
    icon: <ShoppingOutlined />,
    color: '#13c2c2',
  },
  [EntityType.Opportunity]: {
    label: 'Fırsat',
    icon: <CrownOutlined />,
    color: '#eb2f96',
  },
  [EntityType.OpportunityProduct]: {
    label: 'Fırsat Kalemi',
    icon: <AppstoreOutlined />,
    color: '#fa541c',
  },
  [EntityType.Email]: {
    label: 'E-Posta',
    icon: <MailOutlined />,
    color: '#1890ff'
  },
  [EntityType.PhoneCall]: {
    label: 'Telefon',
    icon: <PhoneOutlined />,
    color: '#52c41a'
  },
  [EntityType.Task]: {
    label: 'Görev',
    icon: <CheckSquareOutlined />,
    color: '#faad14'
  },
  [EntityType.Appointment]: {
    label: 'Randevu',
    icon: <CalendarOutlined />,
    color: '#722ed1'
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getEntityIcon = (entityType: EntityTypeValue): React.ReactNode => {
  return EntityTypeConfig[entityType]?.icon || <EllipsisOutlined />;
};

export const getEntityColor = (entityType: EntityTypeValue): string => {
  return EntityTypeConfig[entityType]?.color || '#8c8c8c';
};

export const getEntityLabel = (entityType: EntityTypeValue ): string => {
  return EntityTypeConfig[entityType]?.label || entityType;
};

export const MenuIcons = {
  get dashboard() { return <DashboardOutlined />; },
  get activity()  { return <ScheduleOutlined />; },
  get settings()  { return <SettingOutlined />; },
  get reports()   { return <BarChartOutlined />; },
  get lead()      { return getEntityIcon(EntityType.Lead); },
  get account()   { return getEntityIcon(EntityType.Account); },
  get contact()   { return getEntityIcon(EntityType.Contact); },
  get opportunity() { return getEntityIcon(EntityType.Opportunity); },
  get product()     { return getEntityIcon(EntityType.Product); },
} as const;