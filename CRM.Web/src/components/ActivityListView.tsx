import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/config/route.paths';
import {
  Space,
  Tag,
  Select,
  Tooltip,
  Typography,
  DatePicker,
  Avatar,
  Badge,
} from 'antd';
import type { ColumnsType } from 'antd/es/table/interface';
import type { MenuProps } from 'antd';
import dayjs from 'dayjs';
import {
  ClockCircleOutlined,
  FlagOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import type {
  ActivityListItem,
  ActivityTypeValue,
  ActivityStatusValue,
  ActivityPriorityValue,
  ActivityListFilters,
} from '@/types/activity.types';
import {
  ActivityType,
  ActivityStatus,
  getActivityTypeLabel,
  getActivityTypeColor,
  getActivityStatusLabel,
  getActivityStatusColor,
  getActivityPriorityLabel,
  getActivityPriorityColor,
  activityTypeOptions,
  activityStatusOptions,
  activityPriorityOptions,
  getActivityTypeIcon,
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

export interface ActivityListViewProps {
  initialFilters?: Partial<ActivityListFilters>;
}

// ─── Component ────────────────────────────────────────────────────────────────

const ActivityListView: React.FC<ActivityListViewProps> = ({
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
    activateActivity,
    deactivateActivity,
    assignActivity,
    deleteActivity,
  } = useActivityStore();

  // ── Local data state ───────────────────────────────────────────────────────
  const [activities, setActivities] = useState<ActivityListItem[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFiltersState] = useState<ActivityListFilters>({ ...initialFilters });

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const isFirstRender = useRef(true);
  const isFetching = useRef(false);

  const fetchActivities = useCallback(async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    const { setState, clearState } = useProcessState.getState();
    try {
      setState(StateType.Loading, 'Aktivite listesi yükleniyor...', 'Lütfen bekleyiniz...');
      const response = await activityService.getActivities(page, pageSize, filters);
      setActivities(response.data);
      setHasMore(response.hasMore ?? (response.data.length === pageSize));
      clearState();
    } catch (error) {
      setState(StateType.Error, 'Aktivite listesi yüklenemedi', handleError(error));
    } finally {
      isFetching.current = false;
    }
  }, [page, pageSize, filters]);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; fetchActivities(); }
  }, []);

  useEffect(() => {
    if (!isFirstRender.current) fetchActivities();
  }, [page, pageSize, JSON.stringify(filters)]);

  const initialFiltersRef = useRef(JSON.stringify(initialFilters));
  useEffect(() => {
    const current = JSON.stringify(initialFilters);
    if (initialFiltersRef.current !== current) {
      initialFiltersRef.current = current;
      setFiltersState({ ...initialFilters });
      setPage(1);
    }
  }, [JSON.stringify(initialFilters)]);

  // ── Filter handlers ────────────────────────────────────────────────────────
  const handleSearch = useCallback((value: string) => {
    setFiltersState(prev => ({ ...prev, subject: value || undefined }));
    setPage(1);
  }, []);

  const handleFilterChange = useCallback((field: string, value: unknown) => {
    setFiltersState(prev => ({
      ...prev,
      [field]: value === '' || value === null || value === undefined ? undefined : value,
    }));
    setPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFiltersState({ ...initialFilters });
    setPage(1);
  }, [initialFilters]);

  // ── Bulk: store selectedRowKeys'i sync'le sonra çağır ─────────────────────
  // Store bulk action'ları kendi selectedRowKeys'ini okuduğundan local state
  // zaten store'da tutuluyor — doğrudan çağırmak yeterli.

  // Aktiviteye özgü bulk durum menüsü
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

  // ── Columns ────────────────────────────────────────────────────────────────
  const columns: ColumnsType<ActivityListItem> = useMemo(() => [
    {
      title: 'Konu',
      dataIndex: 'subject',
      key: 'subject',
      render: (text: string, record: ActivityListItem) => (
        <Space>
          <Tooltip title={getActivityTypeLabel(record.activityType)}>
            <Avatar
              size="small"
              style={{
                backgroundColor: 'transparent',
                color: getActivityTypeColor(record.activityType),
                fontSize: 14,
              }}
              icon={getActivityTypeIcon(record.activityType)}
            />
          </Tooltip>
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (status: ActivityStatusValue) => (
        <Tag color={getActivityStatusColor(status)}>{getActivityStatusLabel(status)}</Tag>
      ),
    },
    {
      title: 'Öncelik',
      dataIndex: 'priority',
      key: 'priority',
      width: '10%',
      render: (priority: ActivityPriorityValue) => (
        <Tag color={getActivityPriorityColor(priority)} icon={<FlagOutlined />}>
          {getActivityPriorityLabel(priority)}
        </Tag>
      ),
    },
    {
      title: 'Son Tarih',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: '15%',
      render: (_: string, record: ActivityListItem) => {
        const dateToUse = record.status === ActivityStatus.Completed ? record.endDate : record.dueDate;
        if (!dateToUse) return '-';
        const date = dayjs(dateToUse);
        const isOverdue = record.status !== ActivityStatus.Completed && date.isBefore(dayjs(), 'day');
        const isToday   = record.status !== ActivityStatus.Completed && date.isSame(dayjs(), 'day');
        return (
          <Space>
            <ClockCircleOutlined style={{ color: isOverdue ? '#ff4d4f' : isToday ? '#faad14' : '#8c8c8c' }} />
            <Text type={isOverdue ? 'danger' : undefined}>{date.format('DD.MM.YYYY HH:mm')}</Text>
          </Space>
        );
      },
    },
    {
      title: 'Aktif',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 80,
      align: 'center',
      render: (isActive: boolean) => (
        <Badge status={isActive ? 'success' : 'default'} text={isActive ? 'Evet' : 'Hayır'} />
      ),
    },
    {
      title: 'Sahibi',
      key: 'owner',
      width: '10%',
      render: (_: unknown, record: ActivityListItem) => (
        <Space>
          <Avatar
            size="small"
            style={{ backgroundColor: 'transparent', color: '#1890ff', fontSize: 14 }}
            icon={<UserOutlined />}
          />
          <Text>{record.owner?.name || '-'}</Text>
        </Space>
      ),
    },
  ], []);

  const hasActiveFilters = !!(
    filters.subject ||
    filters.activityType !== undefined ||
    filters.status !== undefined ||
    filters.priority !== undefined ||
    filters.dueDateFrom ||
    filters.dueDateTo
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <ListPageLayout<ActivityListItem>
      // Başlık ActivityList'te gösteriliyor, burada gizle
      title=""
      subtitle=""

      // Arama & filtreler
      searchPlaceholder="Konu ara..."
      searchValue={filters.subject ?? ''}
      onSearch={handleSearch}
      hasActiveFilters={hasActiveFilters}
      onResetFilters={handleResetFilters}
      onRefresh={fetchActivities}
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
          <DatePicker.RangePicker
            placeholder={['Başlangıç', 'Bitiş']} style={{ width: 240 }}
            value={
              filters.dueDateFrom && filters.dueDateTo
                ? [dayjs(filters.dueDateFrom), dayjs(filters.dueDateTo)]
                : null
            }
            onChange={(dates) => {
              handleFilterChange('dueDateFrom', dates?.[0]?.format('YYYY-MM-DD'));
              handleFilterChange('dueDateTo', dates?.[1]?.format('YYYY-MM-DD'));
            }}
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

      // Row aksiyonları
      rowActions={{
        onView:  (record) => navigate(getActivityDetailPath(record.activityType, record.id, 'view')),
        onEdit:  (record) => navigate(getActivityDetailPath(record.activityType, record.id, 'edit')),
        isActiveResolver: (record) => record.isActive,
        onActivate:   { handler: (record) => activateActivity(record.id) },
        onDeactivate: { handler: (record) => deactivateActivity(record.id) },
        onAssign:     { handler: (record, entity) => assignActivity(record.id, entity) },
        onDelete: {
          handler: (record) => deleteActivity(record.id),
          confirm: {
            title: 'Aktivite Silme',
            content: (record) => `"${record.subject}" silinecek. Onaylıyor musunuz?`,
          },
        },
        extraItems: (record): MenuProps['items'] => [
          {
            key: 'complete',
            label: 'Tamamlandı Olarak İşaretle',
            icon: <CheckCircleOutlined />,
            disabled: record.status === ActivityStatus.Completed,
            onClick: (info) => {
              info.domEvent.stopPropagation();
              activityService.completeActivity(record.id).then(fetchActivities);
            },
          },
          {
            key: 'cancel',
            label: 'İptal Et',
            icon: <CloseCircleOutlined />,
            disabled: record.status === ActivityStatus.Cancelled,
            onClick: (info) => {
              info.domEvent.stopPropagation();
              activityService.cancelActivity(record.id).then(fetchActivities);
            },
          },
        ],
      }}

      // Tablo
      dataSource={activities}
      columns={columns}
      rowKey="id"
      tableScrollX={1100}
      onRowClick={(record) =>
        navigate(getActivityDetailPath(record.activityType, record.id, 'view'))
      }

      // Sayfalama
      page={page}
      pageSize={pageSize}
      hasMore={hasMore}
      totalItems={activities?.length ?? 0}
      pageSizeOptions={[10, 20, 50, 100]}
      onPageChange={setPage}
      onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
    />
  );
};

export default ActivityListView;