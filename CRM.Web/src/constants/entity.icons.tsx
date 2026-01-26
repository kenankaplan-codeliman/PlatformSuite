import React from 'react';
import {
  // Activity Icons
  MailOutlined,
  PhoneOutlined,
  CheckSquareOutlined,
  CalendarOutlined,
  ScheduleOutlined,
  ClockCircleOutlined,
  // Lead Icons
  UserAddOutlined,
  UserOutlined,
  ContactsOutlined,
  FunnelPlotOutlined,
  RiseOutlined,
  FireOutlined,
  ThunderboltOutlined,
  StarOutlined,
  TrophyOutlined,
  AimOutlined,
  TeamOutlined,
  // Priority Icons
  FlagOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
  // Status Icons
  CheckCircleOutlined,
  CloseCircleOutlined,
  PauseCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  // Menu & Other Icons
  GlobalOutlined,
  ShareAltOutlined,
  EllipsisOutlined,
  DashboardOutlined,
  BankOutlined,
  SettingOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

import type { ActivityTypeValue, ActivityStatusValue, ActivityPriorityValue, CallDirectionValue } from '@/types/activity.types';
import type { LeadStatusValue, LeadRatingValue, LeadSourceValue } from '@/types/lead.types';
import { ActivityType, ActivityStatus, ActivityPriority, CallDirection } from '@/types/activity.types';
import { LeadStatus, LeadRating, LeadSource } from '@/types/lead.types';

// ==================== ACTIVITY ICON GETTERS ====================

/** Get Activity Type Icon */
export const getActivityTypeIcon = (type: ActivityTypeValue): React.ReactNode => {
  const icons: Record<ActivityTypeValue, React.ReactNode> = {
    [ActivityType.Email]: <MailOutlined />,
    [ActivityType.PhoneCall]: <PhoneOutlined />,
    [ActivityType.Task]: <CheckSquareOutlined />,
    [ActivityType.Appointment]: <CalendarOutlined />,
  };
  return icons[type] ?? <ScheduleOutlined />;
};

/** Get Activity Status Icon */
export const getActivityStatusIcon = (status: ActivityStatusValue): React.ReactNode => {
  const icons: Record<ActivityStatusValue, React.ReactNode> = {
    [ActivityStatus.NotStarted]: <ClockCircleOutlined />,
    [ActivityStatus.InProgress]: <LoadingOutlined />,
    [ActivityStatus.Completed]: <CheckCircleOutlined />,
    [ActivityStatus.Cancelled]: <CloseCircleOutlined />,
    [ActivityStatus.Scheduled]: <CalendarOutlined />,
    [ActivityStatus.WaitingOnSomeone]: <PauseCircleOutlined />,
    [ActivityStatus.Deferred]: <ExclamationCircleOutlined />,
  };
  return icons[status] ?? <ClockCircleOutlined />;
};

/** Get Activity Priority Icon */
export const getActivityPriorityIcon = (priority: ActivityPriorityValue): React.ReactNode => {
  const icons: Record<ActivityPriorityValue, React.ReactNode> = {
    [ActivityPriority.Low]: <ArrowDownOutlined />,
    [ActivityPriority.Normal]: <MinusOutlined />,
    [ActivityPriority.High]: <ArrowUpOutlined />,
  };
  return icons[priority] ?? <FlagOutlined />;
};

/** Get Call Direction Icon */
export const getCallDirectionIcon = (direction: CallDirectionValue): React.ReactNode => {
  const icons: Record<CallDirectionValue, React.ReactNode> = {
    [CallDirection.Incoming]: <PhoneOutlined style={{ color: '#52c41a' }} />,
    [CallDirection.Outgoing]: <PhoneOutlined style={{ color: '#1890ff' }} />,
  };
  return icons[direction] ?? <PhoneOutlined />;
};

// ==================== LEAD ICON GETTERS ====================

/** Get Lead Status Icon */
export const getLeadStatusIcon = (status: LeadStatusValue): React.ReactNode => {
  const icons: Record<LeadStatusValue, React.ReactNode> = {
    [LeadStatus.New]: <UserAddOutlined />,
    [LeadStatus.Contacted]: <PhoneOutlined />,
    [LeadStatus.Qualified]: <TrophyOutlined />,
    [LeadStatus.Unqualified]: <CloseCircleOutlined />,
    [LeadStatus.Converted]: <RiseOutlined />,
  };
  return icons[status] ?? <UserOutlined />;
};

/** Get Lead Rating Icon */
export const getLeadRatingIcon = (rating: LeadRatingValue): React.ReactNode => {
  const icons: Record<LeadRatingValue, React.ReactNode> = {
    [LeadRating.Cold]: <UserOutlined />,
    [LeadRating.Warm]: <ThunderboltOutlined />,
    [LeadRating.Hot]: <FireOutlined />,
  };
  return icons[rating] ?? <StarOutlined />;
};

/** Get Lead Source Icon */
export const getLeadSourceIcon = (source: LeadSourceValue): React.ReactNode => {
  const icons: Record<LeadSourceValue, React.ReactNode> = {
    [LeadSource.Web]: <GlobalOutlined />,
    [LeadSource.Phone]: <PhoneOutlined />,
    [LeadSource.Email]: <MailOutlined />,
    [LeadSource.Referral]: <TeamOutlined />,
    [LeadSource.Partner]: <ContactsOutlined />,
    [LeadSource.Event]: <CalendarOutlined />,
    [LeadSource.Campaign]: <FlagOutlined />,
    [LeadSource.Social]: <ShareAltOutlined />,
    [LeadSource.Other]: <EllipsisOutlined />,
  };
  return icons[source] ?? <AimOutlined />;
};

// ==================== MENU ICON GETTERS ====================

export type MenuIconType = 
  | 'dashboard' 
  | 'lead' 
  | 'leadAlt' 
  | 'activity' 
  | 'activityAlt' 
  | 'account' 
  | 'contact' 
  | 'opportunity' 
  | 'settings' 
  | 'reports';

/** Get Menu Icon by key */
export const getMenuIcon = (key: MenuIconType): React.ReactNode => {
  const icons: Record<MenuIconType, React.ReactNode> = {
    dashboard: <DashboardOutlined />,
    lead: <UserAddOutlined />,
    leadAlt: <FunnelPlotOutlined />,
    activity: <ScheduleOutlined />,
    activityAlt: <ClockCircleOutlined />,
    account: <BankOutlined />,
    contact: <ContactsOutlined />,
    opportunity: <RiseOutlined />,
    settings: <SettingOutlined />,
    reports: <BarChartOutlined />,
  };
  return icons[key] ?? <EllipsisOutlined />;
};

// ==================== MENU ICONS OBJECT (Lazy Getter) ====================

/** 
 * MenuIcons object with getter functions
 * Usage: MenuIcons.dashboard, MenuIcons.lead, etc.
 */
export const MenuIcons = {
  get dashboard() { return <DashboardOutlined />; },
  get lead() { return <UserAddOutlined />; },
  get leadAlt() { return <FunnelPlotOutlined />; },
  get activity() { return <ScheduleOutlined />; },
  get activityAlt() { return <ClockCircleOutlined />; },
  get account() { return <BankOutlined />; },
  get contact() { return <ContactsOutlined />; },
  get opportunity() { return <RiseOutlined />; },
  get settings() { return <SettingOutlined />; },
  get reports() { return <BarChartOutlined />; },
} as const;

// ==================== ACTIVITY TYPE ICONS OBJECT (Lazy Getter) ====================

/**
 * ActivityTypeIcons object with getter functions
 * Usage: ActivityTypeIcons[ActivityType.Email], etc.
 */
export const ActivityTypeIcons = {
  get [ActivityType.Email]() { return <MailOutlined />; },
  get [ActivityType.PhoneCall]() { return <PhoneOutlined />; },
  get [ActivityType.Task]() { return <CheckSquareOutlined />; },
  get [ActivityType.Appointment]() { return <CalendarOutlined />; },
} as const;
