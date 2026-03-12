import { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RoutePaths } from '@/config/route.paths';
import { Button, Dropdown, Flex, Segmented, Space, Typography } from 'antd';
import {
  CalendarOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import type { ActivityTypeValue } from '@/types/activity.types';
import { ActivityType } from '@/types/activity.types';
import ActivityListView from '@/components/ActivityListView';
import ActivityCalendarView from '@/components/ActivityCalendarView';
import { useActivityStore } from '@/stores/activity.store';
import { getEntityIcon, getEntityLabel } from '@/config/entity.config';
import { EntityType } from '@/types/entity.lookup.types';

const { Title, Text } = Typography;

type ViewMode = 'list' | 'calendar';

const getActivityNewPath = (activityType: ActivityTypeValue): string => {
  switch (activityType) {
    case ActivityType.Email:       return RoutePaths.Activity.Email.New;
    case ActivityType.PhoneCall:   return RoutePaths.Activity.PhoneCall.New;
    case ActivityType.Task:        return RoutePaths.Activity.Task.New;
    case ActivityType.Appointment: return RoutePaths.Activity.Appointment.New;
    default:                       return RoutePaths.Activity.List;
  }
};

const ActivityList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [newActivityDropdownOpen, setNewActivityDropdownOpen] = useState(false);
  const { clearSelectedRowKeys } = useActivityStore();

  const urlViewMode = searchParams.get('view') as ViewMode | null;
  const [viewMode, setViewMode] = useState<ViewMode>(
    urlViewMode === 'calendar' ? 'calendar' : 'list'
  );

  // View değiştiğinde seçimi temizle
  const handleViewModeChange = useCallback((value: string | number) => {
    const mode = value as ViewMode;
    setViewMode(mode);
    clearSelectedRowKeys();
    setSearchParams({ view: mode }, { replace: true });
  }, [setSearchParams, clearSelectedRowKeys]);

  const handleCreateActivity = useCallback((type: ActivityTypeValue) => {
    setNewActivityDropdownOpen(false);
    navigate(getActivityNewPath(type));
  }, [navigate]);


  const newActivityMenuItems = [
    {
      key: 'email',
      label: getEntityLabel(EntityType.Email),
      icon: getEntityIcon(EntityType.Email),
      onClick: () => handleCreateActivity(ActivityType.Email),
    },
    {
      key: 'phone',
      label: getEntityLabel(EntityType.PhoneCall),
      icon: getEntityIcon(EntityType.PhoneCall),
      onClick: () => handleCreateActivity(ActivityType.PhoneCall),
    },
    {
      key: 'task',
      label: getEntityLabel(EntityType.Task),
      icon: getEntityIcon(EntityType.Task),
      onClick: () => handleCreateActivity(ActivityType.Task),
    },
    {
      key: 'appointment',
      label: getEntityLabel(EntityType.Appointment),
      icon: getEntityIcon(EntityType.Appointment),
      onClick: () => handleCreateActivity(ActivityType.Appointment),
    },
  ];

  return (
    <>
      {/* Header */}
      <Flex justify="space-between" align="center" style={{ padding: '24px 24px 16px 24px' }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Aktivite Yönetimi</Title>
          <Text type="secondary">E-posta, telefon, görev ve randevularınızı yönetin</Text>
        </div>
        <Space>
          <Segmented
            value={viewMode}
            onChange={handleViewModeChange}
            options={[
              { value: 'list',     icon: <UnorderedListOutlined />, label: 'Liste' },
              { value: 'calendar', icon: <CalendarOutlined />,      label: 'Takvim' },
            ]}
          />
          <Dropdown
            menu={{ items: newActivityMenuItems }}
            trigger={['click']}
            open={newActivityDropdownOpen}
            onOpenChange={setNewActivityDropdownOpen}
          >
            <Button type="primary" icon={<PlusOutlined />}>
              Yeni Aktivite
            </Button>
          </Dropdown>
        </Space>
      </Flex>

      {/* View */}
      {viewMode === 'list'
        ? <ActivityListView />
        : <ActivityCalendarView />
      }
    </>
  );
};

export default ActivityList;