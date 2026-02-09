import { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RoutePaths } from '@/constants/route.paths';
import {
  Button,
  Space,
  Typography,
  Flex,
  Segmented,
  Dropdown,
} from 'antd';
import {
  PlusOutlined,
  ExportOutlined,
  UnorderedListOutlined,
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
  CheckSquareOutlined,
  CalendarOutlined as AppointmentIcon,
} from '@ant-design/icons';
import type { ActivityTypeValue } from '@/types/activity.types';
import { ActivityType } from '@/types/activity.types';
import ActivityListView from '@/components/ActivityListView';
import ActivityCalendarView from '@/components/ActivityCalendarView';
import activityService from '@/services/activity.service';
import { handleError } from '@/util/useHandleError';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

type ViewMode = 'list' | 'calendar';

const ActivityList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [newActivityDropdownOpen, setNewActivityDropdownOpen] = useState(false);

  // Get view mode from URL or default to 'list'
  const urlViewMode = searchParams.get('view') as ViewMode | null;
  const [viewMode, setViewMode] = useState<ViewMode>(
    urlViewMode === 'calendar' ? 'calendar' : 'list'
  );

  // Handle view mode change
  const handleViewModeChange = useCallback(
    (value: string | number) => {
      const mode = value as ViewMode;
      setViewMode(mode);
      setSearchParams({ view: mode }, { replace: true });
    },
    [setSearchParams]
  );

  // Handle create new activity
  const handleCreateActivity = useCallback(
    (type: ActivityTypeValue) => {
      setNewActivityDropdownOpen(false);
      const path = getActivityNewPath(type);
      navigate(path);
    },
    [navigate]
  );

  // Handle export
  const handleExport = useCallback(async () => {
    try {
      // Bu fonksiyon filters'a ihtiyaç duyuyor - component içinden export yapmak daha iyi olabilir
      // Veya global filters state'i tutabilirsiniz
      const blob = await activityService.exportActivities({});
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `activities_${dayjs().format('YYYY-MM-DD')}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      handleError(error);
    }
  }, []);

  // New activity menu items
  const newActivityMenuItems = [
    {
      key: 'email',
      label: 'E-posta',
      icon: <MailOutlined />,
      onClick: () => handleCreateActivity(ActivityType.Email),
    },
    {
      key: 'phone',
      label: 'Telefon Görüşmesi',
      icon: <PhoneOutlined />,
      onClick: () => handleCreateActivity(ActivityType.PhoneCall),
    },
    {
      key: 'task',
      label: 'Görev',
      icon: <CheckSquareOutlined />,
      onClick: () => handleCreateActivity(ActivityType.Task),
    },
    {
      key: 'appointment',
      label: 'Randevu',
      icon: <AppointmentIcon />,
      onClick: () => handleCreateActivity(ActivityType.Appointment),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Page Header */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Aktivite Yönetimi
          </Title>
          <Text type="secondary">E-posta, telefon, görev ve randevularınızı yönetin</Text>
        </div>
        <Space>
          <Segmented
            value={viewMode}
            onChange={handleViewModeChange}
            options={[
              { value: 'list', icon: <UnorderedListOutlined />, label: 'Liste' },
              { value: 'calendar', icon: <CalendarOutlined />, label: 'Takvim' },
            ]}
          />
          <Button icon={<ExportOutlined />} onClick={handleExport}>
            Dışa Aktar
          </Button>
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

      {/* Content based on view mode */}
      {viewMode === 'list' ? (
        <ActivityListView
          showFilters={true}
          showBulkActions={true}
          showPagination={true}
        />
      ) : (
        <ActivityCalendarView showFilters={true} />
      )}
    </div>
  );
};

// Helper function to get new activity path
const getActivityNewPath = (activityType: ActivityTypeValue): string => {
  switch (activityType) {
    case ActivityType.Email:
      return RoutePaths.Activity.Email.New;
    case ActivityType.PhoneCall:
      return RoutePaths.Activity.PhoneCall.New;
    case ActivityType.Task:
      return RoutePaths.Activity.Task.New;
    case ActivityType.Appointment:
      return RoutePaths.Activity.Appointment.New;
    default:
      return RoutePaths.Activity.List;
  }
};

export default ActivityList;