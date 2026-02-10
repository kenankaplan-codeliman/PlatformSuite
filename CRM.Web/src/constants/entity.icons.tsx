import React from 'react';
import {
  MailOutlined,
  PhoneOutlined,
  CheckSquareOutlined,
  CalendarOutlined,
  ScheduleOutlined,
  RocketOutlined,
  UserOutlined,
  ContactsOutlined,
  RiseOutlined,
  EllipsisOutlined,
  DashboardOutlined,
  BankOutlined,
  SettingOutlined,
  BarChartOutlined,
} from '@ant-design/icons';


import { EntityType, type EntityTypeValue } from '@/types/entity.lookup.types';



// ==================== MENU ICON GETTERS ====================

export type MenuIconType = 
  | 'dashboard' 
  | 'lead' 
  | 'activity' 
  | 'account' 
  | 'contact' 
  | 'opportunity' 
  | 'settings' 
  | 'reports';


// ==================== MENU ICONS OBJECT (Lazy Getter) ====================

/** 
 * MenuIcons object with getter functions
 * Usage: MenuIcons.dashboard, MenuIcons.lead, etc.
 */
export const MenuIcons = {
  get dashboard() { return <DashboardOutlined />; },
  get activity() { return <ScheduleOutlined />; },
  get settings() { return <SettingOutlined />; },
  get reports() { return <BarChartOutlined />; },
  get lead() { return getEntityIcon(EntityType.Lead); },
  get account() { return getEntityIcon(EntityType.Account); },
  get contact() { return getEntityIcon(EntityType.Contact); },
  get opportunity() { return getEntityIcon(EntityType.Opportunity); },
  
} as const;


export const EntityIcons ={
  get [EntityType.User]() { return <UserOutlined />; },
  get [EntityType.Account]() { return <BankOutlined />; },
  get [EntityType.Contact]() { return <ContactsOutlined />; },
  get [EntityType.Lead]() { return <RocketOutlined />; },
  get [EntityType.Opportunity]() { return <RiseOutlined />; },
  get [EntityType.Email]() { return <MailOutlined />; },
  get [EntityType.PhoneCall]() { return <PhoneOutlined />; },
  get [EntityType.Task]() { return <CheckSquareOutlined />; },
  get [EntityType.Appointment]() { return <CalendarOutlined />; },
} as const;;

export const getEntityIcon = (entityType: EntityTypeValue) =>
  EntityIcons[entityType] ?? <EllipsisOutlined />;
