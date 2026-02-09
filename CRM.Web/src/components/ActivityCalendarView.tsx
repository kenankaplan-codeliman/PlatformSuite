import { useCallback, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/constants/route.paths';
import {
  Card,
  Button,
  Space,
  Input,
  Select,
  Row,
  Col,
  Tooltip,
  Typography,
  Flex,
  Calendar,
  List,
  Badge,
  ConfigProvider,
  DatePicker,
  Avatar,
} from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import trTR from 'antd/locale/tr_TR';
import {
  FilterOutlined,
  ReloadOutlined,
  SearchOutlined,
  ClearOutlined,
  MailOutlined,
  PhoneOutlined,
  CheckSquareOutlined,
  CalendarOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import {
  getActivityTypeColor,
  getActivityTypeLabel,
  type ActivityListItem,
  type ActivityTypeValue,
  type ActivityListFilters,
} from '@/types/activity.types';
import {
  ActivityType,
  getActivityStatusColor,
  activityTypeOptions,
  activityStatusOptions,
  activityPriorityOptions,
} from '@/types/activity.types';
import activityService from '@/services/activity.service';
import { handleError } from '@/util/useHandleError';
import { StateType, useProcessState } from '@/stores/process.state.store';

const { Text } = Typography;
const { Search } = Input;

// Activity type icons mapping
const getActivityTypeIcon = (type: ActivityTypeValue): React.ReactNode => {
  const icons: Record<ActivityTypeValue, React.ReactNode> = {
    [ActivityType.Email]: <MailOutlined />,
    [ActivityType.PhoneCall]: <PhoneOutlined />,
    [ActivityType.Task]: <CheckSquareOutlined />,
    [ActivityType.Appointment]: <CalendarOutlined />,
  };
  return icons[type];
};

// Helper function to get activity detail path
const getActivityDetailPath = (
  activityType: ActivityTypeValue,
  id: string,
  mode: 'view' | 'edit'
): string => {
  const modeParam = `?mode=${mode}`;

  switch (activityType) {
    case ActivityType.Email:
      return RoutePaths.Activity.Email.Detail(id) + modeParam;
    case ActivityType.PhoneCall:
      return RoutePaths.Activity.PhoneCall.Detail(id) + modeParam;
    case ActivityType.Task:
      return RoutePaths.Activity.Task.Detail(id) + modeParam;
    case ActivityType.Appointment:
      return RoutePaths.Activity.Appointment.Detail(id) + modeParam;
    default:
      return RoutePaths.Activity.List;
  }
};

export interface ActivityCalendarViewProps {
  initialFilters?: Partial<ActivityListFilters>;
  showFilters?: boolean;
}

const ActivityCalendarView: React.FC<ActivityCalendarViewProps> = ({
  initialFilters = {},
  showFilters = true,
}) => {
  const navigate = useNavigate();

  // ========== COMPONENT STATE ==========
  const [calendarActivities, setCalendarActivities] = useState<ActivityListItem[]>([]);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [filters, setFilters] = useState<ActivityListFilters>({
    ...initialFilters,
  });
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchText, setSearchText] = useState(filters.subject || '');

  // ✅ FIX: Ref'ler ile kontrol
  const isFirstRender = useRef(true);
  const isFetching = useRef(false);
  const filtersRef = useRef<ActivityListFilters>(filters);

  // ✅ FIX: filters ref'ini her zaman güncel tut
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // ========== DATA FETCHING ==========
  // ✅ FIX: fetchCalendarActivities - useCallback KULLANMA, normal async fonksiyon yap
  const fetchCalendarActivities = async (startDate: string, endDate: string) => {
    if (isFetching.current) return;
    
    isFetching.current = true;
    const { setState, clearState } = useProcessState.getState();

    try {
      setState(StateType.Loading, 'Takvim aktiviteleri yükleniyor...', 'Lütfen bekleyiniz...');

      // ✅ FIX: ref'ten güncel filters'ı al
      const activities = await activityService.getActivitiesForCalendar(
        startDate,
        endDate,
        filtersRef.current
      );
      setCalendarActivities(activities);

      clearState();
    } catch (error) {
      const errorMessage = handleError(error);
      setState(StateType.Error, 'Takvim aktiviteleri yüklenemedi', errorMessage);
    } finally {
      isFetching.current = false;
    }
  };

  // ✅ FIX: Mount'ta 1 kez fetch
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      const startOfMonth = dayjs(calendarDate).startOf('month').format('YYYY-MM-DD');
      const endOfMonth = dayjs(calendarDate).endOf('month').format('YYYY-MM-DD');
      fetchCalendarActivities(startOfMonth, endOfMonth);
    }
  }, []); // Empty deps - sadece mount'ta

  // ✅ FIX: Filters değişince fetch (ilk render skip)
  useEffect(() => {
    if (!isFirstRender.current) {
      const startOfMonth = dayjs(calendarDate).startOf('month').format('YYYY-MM-DD');
      const endOfMonth = dayjs(calendarDate).endOf('month').format('YYYY-MM-DD');
      fetchCalendarActivities(startOfMonth, endOfMonth);
    }
  }, [JSON.stringify(filters), calendarDate]); // ✅ calendarDate de dependency

  // ========== HANDLERS ==========

  // Handle search
  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
    setFilters(prev => ({
      ...prev,
      subject: value || undefined,
    }));
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value === '' || value === null ? undefined : value,
    }));
  }, []);

  // Handle reset filters
  const handleResetFilters = useCallback(() => {
    setFilters({ ...initialFilters });
    setSearchText('');
  }, [initialFilters]);

  // ✅ FIX: Month change - dependency yok
  const handleMonthChange = useCallback(
    (startDate: string, endDate: string) => {
      fetchCalendarActivities(startDate, endDate);
    },
    [] // ✅ Empty deps - fetchCalendarActivities normal fonksiyon olduğu için sorun yok
  );

  // ✅ FIX: Refresh - dependency yok
  const handleRefresh = useCallback(() => {
    const startOfMonth = dayjs(calendarDate).startOf('month').format('YYYY-MM-DD');
    const endOfMonth = dayjs(calendarDate).endOf('month').format('YYYY-MM-DD');
    fetchCalendarActivities(startOfMonth, endOfMonth);
  }, [calendarDate]); // ✅ Sadece calendarDate dependency

  // ========== CALENDAR RENDERING ==========

  // Get activities for a specific date
  const getActivitiesForDate = useCallback(
    (date: Dayjs): ActivityListItem[] => {
      const dateStr = date.format('YYYY-MM-DD');
      return calendarActivities.filter((activity) => {
        const activityDate = dayjs(activity.dueDate).format('YYYY-MM-DD');
        return activityDate === dateStr;
      });
    },
    [calendarActivities]
  );

  // Calendar date cell render
  const calendarDateCellRender = useCallback(
    (value: Dayjs) => {
      const activities = getActivitiesForDate(value);

      if (activities.length === 0) return null;

      return (
        <List
          size="small"
          dataSource={activities.slice(0, 3)}
          renderItem={(activity) => (
            <List.Item
              style={{ padding: '2px 8px', cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                const path = getActivityDetailPath(activity.activityType, activity.id, 'view');
                navigate(path);
              }}
            >
              <Space size={4}>
                <Badge color={getActivityStatusColor(activity.status)} style={{ fontSize: 8 }} />
                <Tooltip title={getActivityTypeLabel(activity.activityType)}>
                  <Avatar
                    size="small"
                    style={{
                      backgroundColor: 'transparent',
                      color: getActivityTypeColor(activity.activityType),
                      fontSize: 14,
                    }}
                    icon={getActivityTypeIcon(activity.activityType)}
                  />
                </Tooltip>
                <Text ellipsis style={{ fontSize: 12, maxWidth: 150 }}>
                  {activity.subject}
                </Text>
              </Space>
            </List.Item>
          )}
        />
      );
    },
    [calendarActivities, navigate, getActivitiesForDate]
  );

  // Calendar header render
  const calendarHeaderRender = useCallback(
    ({ value, onChange }: { value: Dayjs; onChange: (date: Dayjs) => void }) => {
      return (
        <Flex justify="space-between" align="center" style={{ padding: '8px 16px' }}>
          <Space>
            <Button
              icon={<LeftOutlined />}
              onClick={() => {
                const newDate = value.subtract(1, 'month');
                onChange(newDate);
                setCalendarDate(newDate.toDate());

                const startOfMonth = newDate.startOf('month').format('YYYY-MM-DD');
                const endOfMonth = newDate.endOf('month').format('YYYY-MM-DD');
                handleMonthChange(startOfMonth, endOfMonth);
              }}
            />
            <Button
              icon={<RightOutlined />}
              onClick={() => {
                const newDate = value.add(1, 'month');
                onChange(newDate);
                setCalendarDate(newDate.toDate());

                const startOfMonth = newDate.startOf('month').format('YYYY-MM-DD');
                const endOfMonth = newDate.endOf('month').format('YYYY-MM-DD');
                handleMonthChange(startOfMonth, endOfMonth);
              }}
            />
          </Space>

          <DatePicker
            value={value}
            picker="month"
            onChange={(date) => {
              if (date) {
                onChange(date);
                setCalendarDate(date.toDate());

                const startOfMonth = date.startOf('month').format('YYYY-MM-DD');
                const endOfMonth = date.endOf('month').format('YYYY-MM-DD');
                handleMonthChange(startOfMonth, endOfMonth);
              }
            }}
            format="MMMM YYYY"
            allowClear={false}
          />
        </Flex>
      );
    },
    [handleMonthChange]
  );

  return (
    <>
      {/* Filters Card */}
      {showFilters && (
        <Card style={{ marginBottom: 16 }} styles={{ body: { padding: '16px 24px' } }}>
          <Row gutter={[16, 16]} align="middle">
            <Col flex="auto">
              <Space size="middle" wrap>
                <Search
                  placeholder="Konu ara..."
                  allowClear
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onSearch={handleSearch}
                  style={{ width: 280 }}
                  prefix={<SearchOutlined />}
                />
                {filterVisible && (
                  <>
                    <Select
                      placeholder="Aktivite Tipi"
                      allowClear
                      style={{ width: 160 }}
                      value={filters.activityType}
                      onChange={(value) => handleFilterChange('activityType', value)}
                      options={activityTypeOptions}
                    />
                    <Select
                      placeholder="Durum"
                      allowClear
                      style={{ width: 140 }}
                      value={filters.status}
                      onChange={(value) => handleFilterChange('status', value)}
                      options={activityStatusOptions}
                    />
                    <Select
                      placeholder="Öncelik"
                      allowClear
                      style={{ width: 130 }}
                      value={filters.priority}
                      onChange={(value) => handleFilterChange('priority', value)}
                      options={activityPriorityOptions}
                    />
                  </>
                )}
              </Space>
            </Col>
            <Col>
              <Space>
                <Tooltip title={filterVisible ? 'Filtreleri Gizle' : 'Filtreleri Göster'}>
                  <Button
                    icon={<FilterOutlined />}
                    type={filterVisible ? 'primary' : 'default'}
                    onClick={() => setFilterVisible(!filterVisible)}
                  />
                </Tooltip>
                {(filters.subject ||
                  filters.activityType !== undefined ||
                  filters.status !== undefined ||
                  filters.priority !== undefined) && (
                  <Tooltip title="Filtreleri Temizle">
                    <Button icon={<ClearOutlined />} onClick={handleResetFilters} />
                  </Tooltip>
                )}
                <Tooltip title="Yenile">
                  <Button icon={<ReloadOutlined />} onClick={handleRefresh} />
                </Tooltip>
              </Space>
            </Col>
          </Row>
        </Card>
      )}

      {/* Calendar */}
      <Card styles={{ body: { padding: 0 } }}>
        <ConfigProvider locale={trTR}>
          <Calendar
            cellRender={(current, info) => {
              if (info.type === 'date') return calendarDateCellRender(current);
              return info.originNode;
            }}
            headerRender={calendarHeaderRender}
            value={dayjs(calendarDate)}
            onSelect={(date) => setCalendarDate(date.toDate())}
          />
        </ConfigProvider>
      </Card>
    </>
  );
};

export default ActivityCalendarView;