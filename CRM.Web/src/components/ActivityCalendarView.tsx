import { useCallback, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/config/route.paths';
import {
  Button,
  Space,
  Select,
  Tooltip,
  Typography,
  Flex,
  Calendar,
  Badge,
  ConfigProvider,
  DatePicker,
  Avatar,
  Checkbox,
} from 'antd';
import type { Dayjs } from 'dayjs';
import type { MenuProps } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import trTR from 'antd/locale/tr_TR';
import { LeftOutlined, RightOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import {
  getActivityTypeColor,
  getActivityTypeLabel,
  type ActivityListItem,
  type ActivityTypeValue,
  type ActivityListFilters,
  getActivityTypeIcon,
  ActivityStatus,
} from '@/types/activity.types';
import {
  ActivityType,
  getActivityStatusColor,
  activityTypeOptions,
  activityStatusOptions,
  activityPriorityOptions,
} from '@/types/activity.types';
import activityService from '@/services/activity.service';
import { handleError } from '@/hooks/useHandleError';
import { StateType, useProcessState } from '@/stores/process.state.store';
import { useActivityStore } from '@/stores/activity.store';
import ListPageLayout from '@/components/ListPageLayout';

const { Text } = Typography;

// ─── Helper ───────────────────────────────────────────────────────────────────

const getActivityDetailPath = (
  activityType: ActivityTypeValue,
  id: string,
  mode: 'view' | 'edit'
): string => {
  const modeParam = `?mode=${mode}`;
  switch (activityType) {
    case ActivityType.Email:       return RoutePaths.Activity.Email.Detail(id) + modeParam;
    case ActivityType.PhoneCall:   return RoutePaths.Activity.PhoneCall.Detail(id) + modeParam;
    case ActivityType.Task:        return RoutePaths.Activity.Task.Detail(id) + modeParam;
    case ActivityType.Appointment: return RoutePaths.Activity.Appointment.Detail(id) + modeParam;
    default:                       return RoutePaths.Activity.List;
  }
};

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ActivityCalendarViewProps {
  initialFilters?: Partial<ActivityListFilters>;
}

// ─── Component ────────────────────────────────────────────────────────────────

const ActivityCalendarView: React.FC<ActivityCalendarViewProps> = ({
  initialFilters = {},
}) => {
  const navigate = useNavigate();

  const {
    selectedRowKeys,
    setSelectedRowKeys,
    clearSelectedRowKeys,
    bulkDeleteActivities,
    bulkActivateActivities,
    bulkDeactivateActivities,
    bulkAssignActivities,
    bulkUpdateStatus,
  } = useActivityStore();

  // ── State ──────────────────────────────────────────────────────────────────
  const [calendarActivities, setCalendarActivities] = useState<ActivityListItem[]>([]);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [filters, setFiltersState] = useState<ActivityListFilters>({ ...initialFilters });

  const isFirstRender = useRef(true);
  const isFetching = useRef(false);
  const filtersRef = useRef<ActivityListFilters>(filters);

  useEffect(() => { filtersRef.current = filters; }, [filters]);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchCalendarActivities = async (startDate: string, endDate: string) => {
    if (isFetching.current) return;
    isFetching.current = true;
    const { setState, clearState } = useProcessState.getState();
    try {
      setState(StateType.Loading, 'Takvim aktiviteleri yükleniyor...', 'Lütfen bekleyiniz...');
      const activities = await activityService.getActivitiesForCalendar(
        startDate, endDate, filtersRef.current
      );
      setCalendarActivities(activities);
      clearState();
    } catch (error) {
      setState(StateType.Error, 'Takvim aktiviteleri yüklenemedi', handleError(error));
    } finally {
      isFetching.current = false;
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchCalendarActivities(
        dayjs(calendarDate).startOf('month').format('YYYY-MM-DD'),
        dayjs(calendarDate).endOf('month').format('YYYY-MM-DD')
      );
    }
  }, []);

  useEffect(() => {
    if (!isFirstRender.current) {
      fetchCalendarActivities(
        dayjs(calendarDate).startOf('month').format('YYYY-MM-DD'),
        dayjs(calendarDate).endOf('month').format('YYYY-MM-DD')
      );
    }
  }, [JSON.stringify(filters), calendarDate]);

  // ── Filter handlers ────────────────────────────────────────────────────────
  const handleSearch = useCallback((value: string) => {
    setFiltersState(prev => ({ ...prev, subject: value || undefined }));
  }, []);

  const handleFilterChange = useCallback((field: string, value: unknown) => {
    setFiltersState(prev => ({
      ...prev,
      [field]: value === '' || value === null || value === undefined ? undefined : value,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFiltersState({ ...initialFilters });
  }, [initialFilters]);

  const handleRefresh = useCallback(() => {
    fetchCalendarActivities(
      dayjs(calendarDate).startOf('month').format('YYYY-MM-DD'),
      dayjs(calendarDate).endOf('month').format('YYYY-MM-DD')
    );
  }, [calendarDate]);

  // ── Checkbox toggle ────────────────────────────────────────────────────────
  const handleCheckboxToggle = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRowKeys([...selectedRowKeys, id]);
    } else {
      setSelectedRowKeys(selectedRowKeys.filter(k => k !== id));
    }
  };

  // ── Calendar rendering ─────────────────────────────────────────────────────
  const getActivitiesForDate = useCallback((date: Dayjs): ActivityListItem[] => {
    const dateStr = date.format('YYYY-MM-DD');
    return calendarActivities.filter(a => dayjs(a.dueDate).format('YYYY-MM-DD') === dateStr);
  }, [calendarActivities]);

  const calendarDateCellRender = useCallback((value: Dayjs) => {
    const activities = getActivitiesForDate(value);
    if (activities.length === 0) return null;

    return (
      <Flex vertical gap={0}>
        {activities.slice(0, 3).map((activity) => (
          <Flex key={activity.id} align="center" gap={4} style={{ padding: '2px 4px', width: '100%' }}>
            <Checkbox
              checked={selectedRowKeys.includes(activity.id)}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => handleCheckboxToggle(activity.id, e.target.checked)}
              style={{ flexShrink: 0 }}
            />
            <Flex
              align="center"
              gap={4}
              style={{ flex: 1, cursor: 'pointer', overflow: 'hidden' }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(getActivityDetailPath(activity.activityType, activity.id, 'view'));
              }}
            >
              <Badge color={getActivityStatusColor(activity.status)} />
              <Tooltip title={getActivityTypeLabel(activity.activityType)}>
                <Avatar
                  size="small"
                  style={{
                    backgroundColor: 'transparent',
                    color: getActivityTypeColor(activity.activityType),
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                  icon={getActivityTypeIcon(activity.activityType)}
                />
              </Tooltip>
              <Text ellipsis style={{ fontSize: 12 }}>{activity.subject}</Text>
            </Flex>
          </Flex>
        ))}
      </Flex>
    );
  }, [calendarActivities, navigate, selectedRowKeys]);

  const calendarHeaderRender = useCallback(
    ({ value, onChange }: { value: Dayjs; onChange: (date: Dayjs) => void }) => {
      const changeMonth = (newDate: Dayjs) => {
        onChange(newDate);
        setCalendarDate(newDate.toDate());
        fetchCalendarActivities(
          newDate.startOf('month').format('YYYY-MM-DD'),
          newDate.endOf('month').format('YYYY-MM-DD')
        );
      };
      return (
        <Flex justify="space-between" align="center" style={{ padding: '8px 16px' }}>
          <Space>
            <Button icon={<LeftOutlined />}  onClick={() => changeMonth(value.subtract(1, 'month'))} />
            <Button icon={<RightOutlined />} onClick={() => changeMonth(value.add(1, 'month'))} />
          </Space>
          <DatePicker
            value={value} picker="month" allowClear={false} format="MMMM YYYY"
            onChange={(date) => { if (date) changeMonth(date); }}
          />
        </Flex>
      );
    },
    []
  );

  // ── Bulk: aktiviteye özgü durum menüsü ────────────────────────────────────
  const extraBulkItems = useCallback((): MenuProps['items'] => [
    {
      key: 'complete',
      label: 'Tamamlandı Olarak İşaretle',
      icon: <CheckCircleOutlined />,
      onClick: () => bulkUpdateStatus(ActivityStatus.Completed),
    },
    {
      key: 'cancel',
      label: 'İptal Et',
      icon: <CloseCircleOutlined />,
      onClick: () => bulkUpdateStatus(ActivityStatus.Cancelled),
    },
  ], [bulkUpdateStatus]);

  const hasActiveFilters = !!(
    filters.subject ||
    filters.activityType !== undefined ||
    filters.status !== undefined ||
    filters.priority !== undefined
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <ListPageLayout
      title=""
      subtitle=""

      // Arama & filtreler
      searchPlaceholder="Konu ara..."
      searchValue={filters.subject ?? ''}
      onSearch={handleSearch}
      hasActiveFilters={hasActiveFilters}
      onResetFilters={handleResetFilters}
      onRefresh={handleRefresh}
      renderExtraFilters={() => (
        <>
          <Select
            placeholder="Aktivite Tipi" allowClear style={{ width: 160 }}
            value={filters.activityType}
            onChange={(val) => handleFilterChange('activityType', val)}
            options={activityTypeOptions}
          />
          <Select
            placeholder="Durum" allowClear style={{ width: 140 }}
            value={filters.status}
            onChange={(val) => handleFilterChange('status', val)}
            options={activityStatusOptions}
          />
          <Select
            placeholder="Öncelik" allowClear style={{ width: 130 }}
            value={filters.priority}
            onChange={(val) => handleFilterChange('priority', val)}
            options={activityPriorityOptions}
          />
        </>
      )}

      // Seçim & bulk işlemler
      selectedRowKeys={selectedRowKeys}
      onSelectionChange={setSelectedRowKeys}
      onClearSelection={clearSelectedRowKeys}
      onBulkDelete={{
        handler: bulkDeleteActivities,
        confirm: {
          title: 'Toplu Silme',
          content: (count) => `Seçili ${count} aktivite silinecek. Onaylıyor musunuz?`,
        },
      }}
      onBulkActivate={{ handler: bulkActivateActivities }}
      onBulkDeactivate={{ handler: bulkDeactivateActivities }}
      onBulkAssign={{ handler: bulkAssignActivities }}
      extraBulkItems={extraBulkItems}

      // Takvim içeriği
      renderContent={() => (
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
      )}
    />
  );
};

export default ActivityCalendarView;