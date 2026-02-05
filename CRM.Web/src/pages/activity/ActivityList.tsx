import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RoutePaths } from '@/constants/route.paths';
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Row,
  Col,
  Dropdown,
  Modal,
  Tooltip,
  Badge,
  Typography,
  Flex,
  Segmented,
  Calendar,
  Popover,
  DatePicker,
  List,
  Avatar,
  ConfigProvider,
} from 'antd';
import type { TableProps, MenuProps } from 'antd';
import type { ColumnsType, TableRowSelection } from 'antd/es/table/interface';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import trTR from 'antd/locale/tr_TR';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  FilterOutlined,
  ReloadOutlined,
  MoreOutlined,
  SearchOutlined,
  ClearOutlined,
  CheckCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  CheckSquareOutlined,
  CalendarOutlined,
  UnorderedListOutlined,
  ClockCircleOutlined,
  FlagOutlined,
  EyeOutlined,
  CloseCircleOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import type {
  ActivityBase,
  ActivityTypeValue,
  ActivityStatusValue,
  ActivityPriorityValue,
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
  activityTypeFilters,
  activityStatusFilters,
  activityPriorityFilters,
} from '@/types/activity.types';
import { useActivityStore, type ActivityViewMode } from '@/stores/activity.store';
import activityService from '@/services/activity.service';
import CustomPagination from '@/components/CustomPagination';
import { handleError } from '@/util/useHandleError';
import { StateType, useProcessState } from '@/stores/process.state.store';

const { Title, Text } = Typography;
const { Search } = Input;

// Activity type icons mapping - OUTSIDE COMPONENT
const getActivityTypeIcon = (type: ActivityTypeValue): React.ReactNode => {
  const icons: Record<ActivityTypeValue, React.ReactNode> = {
    [ActivityType.Email]: <MailOutlined />,
    [ActivityType.PhoneCall]: <PhoneOutlined />,
    [ActivityType.Task]: <CheckSquareOutlined />,
    [ActivityType.Appointment]: <CalendarOutlined />,
  };
  return icons[type];
};

const ActivityList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [newActivityDropdownOpen, setNewActivityDropdownOpen] = useState(false);

  // Get view mode from URL or default to 'list'
  const urlViewMode = searchParams.get('view') as ActivityViewMode | null;
  const initialViewMode: ActivityViewMode = urlViewMode === 'calendar' ? 'calendar' : 'list';

  // Store state and actions
  const {
    viewMode,
    setViewMode,
    activities,
    hasMore,
    page,
    pageSize,
    filters,
    selectedRowKeys,
    calendarActivities,
    calendarDate,
    fetchActivities,
    fetchCalendarActivities,
    setPagination,
    setFilters,
    resetFilters,
    setSelectedRowKeys,
    clearSelectedRowKeys,
    bulkDeleteActivities,
    bulkUpdateStatus,
    completeActivity,
    cancelActivity,
    setCalendarDate,
  } = useActivityStore();

  // Ref to prevent double fetch (Lead store ile aynı)
  const isFirstRender = useRef(true);

  // Initialize view mode from URL (only once)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setViewMode(initialViewMode);

      if (initialViewMode === 'list') {
        fetchActivities();
      } else {
        const startOfMonth = dayjs(calendarDate).startOf('month').format('YYYY-MM-DD');
        const endOfMonth = dayjs(calendarDate).endOf('month').format('YYYY-MM-DD');
        fetchCalendarActivities(startOfMonth, endOfMonth);
      }
    }
  }, [initialViewMode, setViewMode, fetchActivities, fetchCalendarActivities, calendarDate]);

  // Handle view mode change
  const handleViewModeChange = useCallback(
    (value: string | number) => {
      const mode = value as ActivityViewMode;
      setViewMode(mode);
      setSearchParams({ view: mode }, { replace: true });

      // Fetch data based on new view mode
      if (mode === 'list') {
        fetchActivities();
      } else {
        const startOfMonth = dayjs(calendarDate).startOf('month').format('YYYY-MM-DD');
        const endOfMonth = dayjs(calendarDate).endOf('month').format('YYYY-MM-DD');
        fetchCalendarActivities(startOfMonth, endOfMonth);
      }
    },
    [setViewMode, setSearchParams, calendarDate, fetchActivities, fetchCalendarActivities]
  );

  // Handle row click - navigate to edit page
  const handleRowClick = useCallback(
    (record: ActivityBase) => {
      const path = getActivityDetailPath(record.activityType, record.id, 'edit');
      navigate(path);
    },
    [navigate]
  );

  // Handle view (read mode)
  const handleView = useCallback(
    (record: ActivityBase) => {
      const path = getActivityDetailPath(record.activityType, record.id, 'view');
      navigate(path);
    },
    [navigate]
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

  // Handle search
  const handleSearch = useCallback(
    (value: string) => {
      setSearchText(value);
      setFilters({
        ...filters,
        subject: value || undefined,
      });
    },
    [filters, setFilters]
  );

  // Handle filter change
  const handleFilterChange = useCallback(
    (field: string, value: unknown) => {
      setFilters({
        ...filters,
        [field]: value === '' || value === null ? undefined : value,
      });
    },
    [filters, setFilters]
  );

  // Handle bulk delete
  const handleBulkDelete = useCallback(() => {
    Modal.confirm({
      title: 'Toplu Silme',
      content: `Seçili ${selectedRowKeys.length} aktivite silinecek. Onaylıyor musunuz?`,
      okText: 'Sil',
      okType: 'danger',
      cancelText: 'İptal',
      onOk: async () => {
        await bulkDeleteActivities();
      },
    });
  }, [selectedRowKeys.length, bulkDeleteActivities]);

  // Handle bulk status update
  const handleBulkStatusUpdate = useCallback(
    async (status: ActivityStatusValue) => {
      await bulkUpdateStatus(status);
    },
    [bulkUpdateStatus]
  );

  // Handle complete activity
  const handleComplete = useCallback(
    async (record: ActivityBase) => {
      await completeActivity(record.id);
    },
    [completeActivity]
  );

  // Handle cancel activity
  const handleCancel = useCallback(
    async (record: ActivityBase) => {
      await cancelActivity(record.id);
    },
    [cancelActivity]
  );

  // Handle export
  const handleExport = useCallback(async () => {
    const { setState } = useProcessState.getState();

    try {
      setState(StateType.Loading, 'Dışa Aktarılıyor', 'Aktivite listesi hazırlanıyor...');

      const blob = await activityService.exportActivities(filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `activities_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);

      setState(StateType.Success, 'Dışa Aktarıldı', 'Aktivite listesi dışa aktarıldı');
    } catch (error) {
      const errorMessage = handleError(error);
      setState(StateType.Error, 'Aktivite listesi dışa aktarılamadı', errorMessage);
    }
  }, [filters]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    if (viewMode === 'list') {
      fetchActivities();
    } else {
      const startOfMonth = dayjs(calendarDate).startOf('month').format('YYYY-MM-DD');
      const endOfMonth = dayjs(calendarDate).endOf('month').format('YYYY-MM-DD');
      fetchCalendarActivities(startOfMonth, endOfMonth);
    }
  }, [viewMode, calendarDate, fetchActivities, fetchCalendarActivities]);

  // Handle page change (for CustomPagination)
  const handlePageChange = useCallback(
    (newPage: number) => {
      setPagination({ page: newPage });
    },
    [setPagination]
  );

  // Handle page size change (for CustomPagination)
  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      setPagination({ pageSize: newPageSize });
    },
    [setPagination]
  );

  // New activity dropdown menu items
  const newActivityMenuItems: MenuProps['items'] = useMemo(
    () => [
      {
        key: 'email',
        label: 'E-posta',
        icon: <MailOutlined style={{ color: getActivityTypeColor(ActivityType.Email) }} />,
        onClick: () => handleCreateActivity(ActivityType.Email),
      },
      {
        key: 'phonecall',
        label: 'Telefon Görüşmesi',
        icon: <PhoneOutlined style={{ color: getActivityTypeColor(ActivityType.PhoneCall) }} />,
        onClick: () => handleCreateActivity(ActivityType.PhoneCall),
      },
      {
        key: 'task',
        label: 'Görev',
        icon: <CheckSquareOutlined style={{ color: getActivityTypeColor(ActivityType.Task) }} />,
        onClick: () => handleCreateActivity(ActivityType.Task),
      },
      {
        key: 'appointment',
        label: 'Randevu',
        icon: <CalendarOutlined style={{ color: getActivityTypeColor(ActivityType.Appointment) }} />,
        onClick: () => handleCreateActivity(ActivityType.Appointment),
      },
    ],
    [handleCreateActivity]
  );

  // Bulk action menu items
  const bulkActionItems: MenuProps['items'] = useMemo(
    () => [
      {
        key: 'status',
        label: 'Durum Değiştir',
        icon: <CheckCircleOutlined />,
        children: [
          {
            key: `status-${ActivityStatus.NotStarted}`,
            label: getActivityStatusLabel(ActivityStatus.NotStarted),
            onClick: () => handleBulkStatusUpdate(ActivityStatus.NotStarted),
          },
          {
            key: `status-${ActivityStatus.InProgress}`,
            label: getActivityStatusLabel(ActivityStatus.InProgress),
            onClick: () => handleBulkStatusUpdate(ActivityStatus.InProgress),
          },
          {
            key: `status-${ActivityStatus.Completed}`,
            label: getActivityStatusLabel(ActivityStatus.Completed),
            onClick: () => handleBulkStatusUpdate(ActivityStatus.Completed),
          },
          {
            key: `status-${ActivityStatus.Cancelled}`,
            label: getActivityStatusLabel(ActivityStatus.Cancelled),
            onClick: () => handleBulkStatusUpdate(ActivityStatus.Cancelled),
          },
        ],
      },
      { type: 'divider' as const },
      {
        key: 'delete',
        label: 'Seçilenleri Sil',
        icon: <DeleteOutlined />,
        danger: true,
        onClick: handleBulkDelete,
      },
    ],
    [handleBulkStatusUpdate, handleBulkDelete]
  );

  // Row action menu
  const getRowActionItems = useCallback(
    (record: ActivityBase): MenuProps['items'] => [
      {
        key: 'view',
        label: 'Görüntüle',
        icon: <EyeOutlined />,
        onClick: (info) => {
          info.domEvent.stopPropagation();
          handleView(record);
        },
      },
      {
        key: 'edit',
        label: 'Düzenle',
        icon: <EditOutlined />,
        onClick: (info) => {
          info.domEvent.stopPropagation();
          handleRowClick(record);
        },
      },
      { type: 'divider' as const },
      {
        key: 'complete',
        label: 'Tamamla',
        icon: <CheckCircleOutlined />,
        disabled: record.status === ActivityStatus.Completed,
        onClick: (info) => {
          info.domEvent.stopPropagation();
          handleComplete(record);
        },
      },
      {
        key: 'cancel',
        label: 'İptal Et',
        icon: <CloseCircleOutlined />,
        disabled: record.status === ActivityStatus.Cancelled,
        onClick: (info) => {
          info.domEvent.stopPropagation();
          handleCancel(record);
        },
      },
      { type: 'divider' as const },
      {
        key: 'delete',
        label: 'Sil',
        icon: <DeleteOutlined />,
        danger: true,
        onClick: (info) => {
          info.domEvent.stopPropagation();

          const { deleteActivity } = useActivityStore.getState();

          Modal.confirm({
            title: 'Aktivite Silme',
            content: `"${record.subject}" aktivitesi silinecek. Onaylıyor musunuz?`,
            okText: 'Sil',
            okType: 'danger',
            cancelText: 'İptal',
            onOk: async () => {
              await deleteActivity(record.id);
            },
          });
        },
      },
    ],
    [handleView, handleRowClick, handleComplete, handleCancel]
  );

  // Table columns
  const columns: ColumnsType<ActivityBase> = [
    {
      title: 'Tip',
      dataIndex: 'activityType',
      key: 'activityType',
      width: 80,
      align: 'center',
      filters: activityTypeFilters,
      render: (type: ActivityTypeValue) => (
        <Tooltip title={getActivityTypeLabel(type)}>
          <Avatar
            size="small"
            style={{
              backgroundColor: getActivityTypeColor(type),
              fontSize: 14,
            }}
            icon={getActivityTypeIcon(type)}
          />
        </Tooltip>
      ),
    },
    {
      title: 'Konu',
      dataIndex: 'subject',
      key: 'subject',
      sorter: true,
      width: 300,
      ellipsis: true,
      render: (text: string, record: ActivityBase) => (
        <Space orientation="vertical" size={0}>
          <Text strong style={{ cursor: 'pointer', color: '#1890ff' }}>
            {text}
          </Text>
          {record.regardingEntity && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.regardingEntity.entityType}: {record.regardingEntity.id}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      filters: activityStatusFilters,
      render: (status: ActivityStatusValue) => (
        <Tag color={getActivityStatusColor(status)}>{getActivityStatusLabel(status)}</Tag>
      ),
    },
    {
      title: 'Öncelik',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      filters: activityPriorityFilters,
      render: (priority: ActivityPriorityValue) => (
        <Tag color={getActivityPriorityColor(priority)} icon={<FlagOutlined />}>
          {getActivityPriorityLabel(priority)}
        </Tag>
      ),
    },
    {
      title: 'Bitiş Tarihi',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 150,
      sorter: true,
      render: (date: string) => {
        if (!date) return '-';
        const dueDate = dayjs(date);
        const isOverdue = dueDate.isBefore(dayjs(), 'day');
        const isToday = dueDate.isSame(dayjs(), 'day');
        return (
          <Space>
            <ClockCircleOutlined
              style={{
                color: isOverdue ? '#ff4d4f' : isToday ? '#faad14' : '#8c8c8c',
              }}
            />
            <Text type={isOverdue ? 'danger' : undefined}>
              {dueDate.format('DD.MM.YYYY HH:mm')}
            </Text>
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
      filters: [
        { text: 'Aktif', value: true },
        { text: 'Pasif', value: false },
      ],
      render: (isActive: boolean) => (
        <Badge status={isActive ? 'success' : 'default'} text={isActive ? 'Evet' : 'Hayır'} />
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 60,
      fixed: 'right',
      render: (_: unknown, record: ActivityBase) => (
        <Dropdown menu={{ items: getRowActionItems(record) }} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
        </Dropdown>
      ),
    },
  ];

  // Row selection config
  const rowSelection: TableRowSelection<ActivityBase> = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys as string[]),
    preserveSelectedRowKeys: true,
  };

  // Table change handler - sadece filter değişikliklerini handle ediyor
  const handleTableChange: TableProps<ActivityBase>['onChange'] = (_pagination, tableFilters) => {
    const newFilters = { ...filters };

    if (tableFilters.activityType) {
      newFilters.activityType = tableFilters.activityType[0] as ActivityTypeValue;
    } else {
      newFilters.activityType = undefined;
    }

    if (tableFilters.status) {
      newFilters.status = tableFilters.status[0] as ActivityStatusValue;
    } else {
      newFilters.status = undefined;
    }

    if (tableFilters.priority) {
      newFilters.priority = tableFilters.priority[0] as ActivityPriorityValue;
    } else {
      newFilters.priority = undefined;
    }

    if (tableFilters.isActive !== undefined && tableFilters.isActive !== null && tableFilters.isActive.length > 0) {
      newFilters.isActive = tableFilters.isActive[0] as boolean;
    } else {
      newFilters.isActive = undefined;
    }

    setFilters(newFilters);
  };

  // Calendar date cell render
// Calendar date cell render - DÜZELTILMIŞ VERSİYON
// Bu fonksiyonu mevcut calendarDateCellRender ile değiştirin

// Calendar date cell render - DÜZELTILMIŞ VERSİYON
// Bu fonksiyonu mevcut calendarDateCellRender ile değiştirin

// Calendar date cell render - DÜZELTILMIŞ VERSİYON
// Bu fonksiyonu mevcut calendarDateCellRender ile değiştirin

const calendarDateCellRender = useCallback(
  (value: Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD');
    
    // Aktiviteyi birden fazla tarih alanına göre filtrele
    const dayActivities = calendarActivities.filter((activity) => {
      const activityStartDate = activity.startDate
        ? dayjs(activity.startDate).format('YYYY-MM-DD')
        : null;
      const activityDueDate = activity.dueDate
        ? dayjs(activity.dueDate).format('YYYY-MM-DD')
        : null;
      const activityEndDate = activity.endDate
        ? dayjs(activity.endDate).format('YYYY-MM-DD')
        : null;

      return (
        activityStartDate === dateStr ||
        activityDueDate === dateStr ||
        activityEndDate === dateStr
      );
    });

    if (dayActivities.length === 0) return null;

    return (
      <Popover
        content={
          <List
            size="small"
            dataSource={dayActivities}
            renderItem={(item) => (
              <List.Item
                style={{ cursor: 'pointer', padding: '0 0 0 0' }}
                onClick={() => handleView(item)}
              >
                <Space>
                  <Avatar
                    size="small"
                    style={{
                      backgroundColor: getActivityTypeColor(item.activityType),
                      fontSize: 12,
                    }}
                    icon={getActivityTypeIcon(item.activityType)}
                  />
                  <div>
                    <Text ellipsis style={{ maxWidth: 220, display: 'block', fontSize: 13 }}>
                      {item.subject}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.startDate
                        ? dayjs(item.startDate).format('HH:mm')
                        : item.dueDate
                          ? dayjs(item.dueDate).format('HH:mm')
                          : ''}{' '}
                      - {getActivityStatusLabel(item.status)}
                    </Text>
                  </div>
                </Space>
              </List.Item>
            )}
          />
        }
        title={`${value.format('DD MMMM YYYY')} - ${dayActivities.length} aktivite`}
        trigger="click"
      >
        <div
          style={{
            margin: 0,
            padding: '0 0 0 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: 4,
          }}
        >
          {dayActivities.slice(0, 3).map((activity) => (
            <div
              key={activity.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                width: '100%',
                minWidth: 0,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: getActivityTypeColor(activity.activityType),
                  flexShrink: 0,
                }}
              />
              <Text
                ellipsis
                style={{
                  fontSize: 12,
                  flex: 1,
                  minWidth: 0,
                  lineHeight: 1.4,
                }}
              >
                {activity.subject}
              </Text>
            </div>
          ))}
          {dayActivities.length > 3 && (
            <Text type="secondary" style={{ fontSize: 11 }}>
              +{dayActivities.length - 3} daha
            </Text>
          )}
        </div>
      </Popover>
    );
  },
  [calendarActivities, handleView]
);
  // Calendar header render
  const calendarHeaderRender = useCallback(
    ({ value, onChange }: { value: Dayjs; onChange: (date: Dayjs) => void }) => {
      const handlePrevMonth = () => {
        const newDate = value.subtract(1, 'month');
        onChange(newDate);
        setCalendarDate(newDate.toDate());
        // Fetch new month's activities
        const startOfMonth = newDate.startOf('month').format('YYYY-MM-DD');
        const endOfMonth = newDate.endOf('month').format('YYYY-MM-DD');
        fetchCalendarActivities(startOfMonth, endOfMonth);
      };

      const handleNextMonth = () => {
        const newDate = value.add(1, 'month');
        onChange(newDate);
        setCalendarDate(newDate.toDate());
        // Fetch new month's activities
        const startOfMonth = newDate.startOf('month').format('YYYY-MM-DD');
        const endOfMonth = newDate.endOf('month').format('YYYY-MM-DD');
        fetchCalendarActivities(startOfMonth, endOfMonth);
      };

      const handleToday = () => {
        const today = dayjs();
        onChange(today);
        setCalendarDate(today.toDate());
        // Fetch current month's activities
        const startOfMonth = today.startOf('month').format('YYYY-MM-DD');
        const endOfMonth = today.endOf('month').format('YYYY-MM-DD');
        fetchCalendarActivities(startOfMonth, endOfMonth);
      };

      return (
        <Flex justify="space-between" align="center" style={{ padding: '8px 16px' }}>
          <Space>
            <Button icon={<LeftOutlined />} onClick={handlePrevMonth} />
            <Button onClick={handleToday}>Bugün</Button>
            <Button icon={<RightOutlined />} onClick={handleNextMonth} />
          </Space>
          <Title level={4} style={{ margin: 0 }}>
            {value.format('MMMM YYYY')}
          </Title>
          <DatePicker
            picker="month"
            value={value}
            onChange={(date) => {
              if (date) {
                onChange(date);
                setCalendarDate(date.toDate());
                // Fetch selected month's activities
                const startOfMonth = date.startOf('month').format('YYYY-MM-DD');
                const endOfMonth = date.endOf('month').format('YYYY-MM-DD');
                fetchCalendarActivities(startOfMonth, endOfMonth);
              }
            }}
            format="MMMM YYYY"
            allowClear={false}
          />
        </Flex>
      );
    },
    [setCalendarDate, fetchCalendarActivities]
  );

  // Render List View
  const renderListView = () => (
    <>
      {selectedRowKeys.length > 0 && (
        <Card
          style={{ marginBottom: 16, background: '#e6f7ff', borderColor: '#91d5ff' }}
          styles={{ body: { padding: '12px 24px' } }}
        >
          <Flex justify="space-between" align="center">
            <Space>
              <Text strong>{selectedRowKeys.length} öğe seçildi</Text>
              <Button type="link" size="small" onClick={clearSelectedRowKeys}>
                Seçimi Temizle
              </Button>
            </Space>
            <Space>
              <Dropdown menu={{ items: bulkActionItems }} trigger={['click']}>
                <Button type="primary">
                  <Space>
                    Toplu İşlemler
                    <MoreOutlined />
                  </Space>
                </Button>
              </Dropdown>
            </Space>
          </Flex>
        </Card>
      )}

      <Card styles={{ body: { padding: 0 } }}>
        <Table<ActivityBase>
          rowKey="id"
          columns={columns}
          dataSource={activities}
          loading={false}
          rowSelection={rowSelection}
          pagination={false}
          onChange={handleTableChange}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: { cursor: 'pointer' },
          })}
          scroll={{ x: 1100 }}
          size="middle"
        />

        {/* Custom Pagination */}
        <CustomPagination
          current={page}
          pageSize={pageSize}
          hasMore={hasMore}
          totalItems={activities?.length ?? 0}
          pageSizeOptions={[10, 20, 50, 100]}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </Card>
    </>
  );

  // Render Calendar View
  const renderCalendarView = () => (
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
  );

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

      {/* Filters Card */}
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
                  <DatePicker.RangePicker
                    placeholder={['Başlangıç', 'Bitiş']}
                    style={{ width: 240 }}
                    onChange={(dates) => {
                      if (dates) {
                        handleFilterChange('dueDateFrom', dates[0]?.format('YYYY-MM-DD'));
                        handleFilterChange('dueDateTo', dates[1]?.format('YYYY-MM-DD'));
                      } else {
                        handleFilterChange('dueDateFrom', undefined);
                        handleFilterChange('dueDateTo', undefined);
                      }
                    }}
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
                filters.priority !== undefined ||
                filters.dueDateFrom ||
                filters.dueDateTo) && (
                <Tooltip title="Filtreleri Temizle">
                  <Button
                    icon={<ClearOutlined />}
                    onClick={() => {
                      resetFilters();
                      setSearchText('');
                    }}
                  />
                </Tooltip>
              )}
              <Tooltip title="Yenile">
                <Button icon={<ReloadOutlined />} onClick={handleRefresh} />
              </Tooltip>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Content based on view mode */}
      {viewMode === 'list' ? renderListView() : renderCalendarView()}
    </div>
  );
};

// Helper function to get activity detail path using RoutePaths
const getActivityDetailPath = (
  activityType: ActivityTypeValue,
  id: string,
  mode: 'view' | 'edit'
): string => {
  const modeParam = `?mode=${mode}`;

  switch (activityType) {
    case ActivityType.Email:
      return RoutePaths.Activity.Email.Edit(id) + modeParam;
    case ActivityType.PhoneCall:
      return RoutePaths.Activity.PhoneCall.Edit(id) + modeParam;
    case ActivityType.Task:
      return RoutePaths.Activity.Task.Edit(id) + modeParam;
    case ActivityType.Appointment:
      return RoutePaths.Activity.Appointment.Edit(id) + modeParam;
    default:
      return RoutePaths.Activity.List;
  }
};

// Helper function to get new activity path using RoutePaths
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
