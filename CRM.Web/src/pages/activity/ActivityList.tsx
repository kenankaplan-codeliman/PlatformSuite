import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  message,
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

// Get detail route path based on activity type - OUTSIDE COMPONENT
const getActivityDetailPath = (activityType: ActivityTypeValue, id?: string): string => {
  const typeRoutes: Record<ActivityTypeValue, string> = {
    [ActivityType.Email]: 'email',
    [ActivityType.PhoneCall]: 'phonecall',
    [ActivityType.Task]: 'task',
    [ActivityType.Appointment]: 'appointment',
  };
  const route = typeRoutes[activityType];
  return id ? `/activity/${route}/${id}` : `/activity/${route}/new`;
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
  const viewMode = useActivityStore((state) => state.viewMode);
  const setViewMode = useActivityStore((state) => state.setViewMode);
  const activities = useActivityStore((state) => state.activities);
  const total = useActivityStore((state) => state.total);
  const page = useActivityStore((state) => state.page);
  const pageSize = useActivityStore((state) => state.pageSize);
  const loading = useActivityStore((state) => state.loading);
  const error = useActivityStore((state) => state.error);
  const filters = useActivityStore((state) => state.filters);
  const selectedRowKeys = useActivityStore((state) => state.selectedRowKeys);
  const calendarActivities = useActivityStore((state) => state.calendarActivities);
  const calendarLoading = useActivityStore((state) => state.calendarLoading);
  const calendarDate = useActivityStore((state) => state.calendarDate);
  const fetchActivities = useActivityStore((state) => state.fetchActivities);
  const fetchCalendarActivities = useActivityStore((state) => state.fetchCalendarActivities);
  const setPage = useActivityStore((state) => state.setPage);
  const setPageSize = useActivityStore((state) => state.setPageSize);
  const setFilters = useActivityStore((state) => state.setFilters);
  const resetFilters = useActivityStore((state) => state.resetFilters);
  const setSelectedRowKeys = useActivityStore((state) => state.setSelectedRowKeys);
  const clearSelectedRowKeys = useActivityStore((state) => state.clearSelectedRowKeys);
  const bulkDeleteActivities = useActivityStore((state) => state.bulkDeleteActivities);
  const bulkUpdateStatus = useActivityStore((state) => state.bulkUpdateStatus);
  const completeActivity = useActivityStore((state) => state.completeActivity);
  const cancelActivity = useActivityStore((state) => state.cancelActivity);
  const setCalendarDate = useActivityStore((state) => state.setCalendarDate);

  // Initialize view mode from URL
  useEffect(() => {
    setViewMode(initialViewMode);
  }, [initialViewMode, setViewMode]);

  // Fetch data based on view mode
  useEffect(() => {
    if (viewMode === 'list') {
      fetchActivities();
    } else {
      const startOfMonth = dayjs(calendarDate).startOf('month').format('YYYY-MM-DD');
      const endOfMonth = dayjs(calendarDate).endOf('month').format('YYYY-MM-DD');
      fetchCalendarActivities(startOfMonth, endOfMonth);
    }
  }, [viewMode, calendarDate, fetchActivities, fetchCalendarActivities]);

  // Show error message
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  // Handle view mode change
  const handleViewModeChange = useCallback(
    (value: string | number) => {
      const mode = value as ActivityViewMode;
      setViewMode(mode);
      setSearchParams({ view: mode }, { replace: true });
    },
    [setViewMode, setSearchParams]
  );

  // Handle row click
  const handleRowClick = useCallback(
    (record: ActivityBase) => {
      navigate(`${getActivityDetailPath(record.activityType, record.id)}?mode=edit`);
    },
    [navigate]
  );

  // Handle view
  const handleView = useCallback(
    (record: ActivityBase) => {
      navigate(`${getActivityDetailPath(record.activityType, record.id)}?mode=view`);
    },
    [navigate]
  );

  // Handle create new activity
  const handleCreateActivity = useCallback(
    (type: ActivityTypeValue) => {
      setNewActivityDropdownOpen(false);
      navigate(getActivityDetailPath(type));
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
        try {
          await bulkDeleteActivities();
          message.success(`${selectedRowKeys.length} aktivite başarıyla silindi`);
        } catch {
          message.error('Silme işlemi sırasında hata oluştu');
        }
      },
    });
  }, [selectedRowKeys.length, bulkDeleteActivities]);

  // Handle bulk status update
  const handleBulkStatusUpdate = useCallback(
    async (status: ActivityStatusValue) => {
      try {
        await bulkUpdateStatus(status);
        message.success(`${selectedRowKeys.length} aktivite durumu güncellendi`);
      } catch {
        message.error('Durum güncelleme sırasında hata oluştu');
      }
    },
    [selectedRowKeys.length, bulkUpdateStatus]
  );

  // Handle complete activity
  const handleComplete = useCallback(
    async (record: ActivityBase) => {
      try {
        await completeActivity(record.id);
        message.success('Aktivite tamamlandı');
      } catch {
        message.error('Aktivite tamamlanırken hata oluştu');
      }
    },
    [completeActivity]
  );

  // Handle cancel activity
  const handleCancel = useCallback(
    async (record: ActivityBase) => {
      try {
        await cancelActivity(record.id);
        message.success('Aktivite iptal edildi');
      } catch {
        message.error('Aktivite iptal edilirken hata oluştu');
      }
    },
    [cancelActivity]
  );

  // Handle export
  const handleExport = useCallback(async () => {
    try {
      const blob = await activityService.exportActivities(filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `activities_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      message.success('Aktivite listesi dışa aktarıldı');
    } catch {
      message.error('Dışa aktarma sırasında hata oluştu');
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
        onClick: () => handleView(record),
      },
      {
        key: 'edit',
        label: 'Düzenle',
        icon: <EditOutlined />,
        onClick: () => handleRowClick(record),
      },
      { type: 'divider' as const },
      {
        key: 'complete',
        label: 'Tamamla',
        icon: <CheckCircleOutlined />,
        disabled: record.status === ActivityStatus.Completed,
        onClick: () => handleComplete(record),
      },
      {
        key: 'cancel',
        label: 'İptal Et',
        icon: <CloseCircleOutlined />,
        disabled: record.status === ActivityStatus.Cancelled,
        onClick: () => handleCancel(record),
      },
      { type: 'divider' as const },
      {
        key: 'delete',
        label: 'Sil',
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => {
          Modal.confirm({
            title: 'Aktivite Silme',
            content: `"${record.subject}" aktivitesi silinecek. Onaylıyor musunuz?`,
            okText: 'Sil',
            okType: 'danger',
            cancelText: 'İptal',
            onOk: async () => {
              try {
                await activityService.deleteActivity(record.id);
                message.success('Aktivite başarıyla silindi');
                fetchActivities();
              } catch {
                message.error('Silme işlemi sırasında hata oluştu');
              }
            },
          });
        },
      },
    ],
    [handleView, handleRowClick, handleComplete, handleCancel, fetchActivities]
  );

  // Table columns
  const columns: ColumnsType<ActivityBase> = useMemo(
    () => [
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
          <Space direction="vertical" size={0}>
            <Text strong style={{ cursor: 'pointer', color: '#1890ff' }}>
              {text}
            </Text>
            {record.regardingEntityType && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.regardingEntityType}: {record.regardingEntityId}
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
    ],
    [getRowActionItems]
  );

  // Row selection config
  const rowSelection: TableRowSelection<ActivityBase> = useMemo(
    () => ({
      selectedRowKeys,
      onChange: (keys) => setSelectedRowKeys(keys as string[]),
      preserveSelectedRowKeys: true,
    }),
    [selectedRowKeys, setSelectedRowKeys]
  );

  // Table change handler
  const handleTableChange: TableProps<ActivityBase>['onChange'] = useCallback(
    (pagination: any, tableFilters: Record<string, any>) => {
      if (pagination.current !== page) {
        setPage(pagination.current || 1);
      }
      if (pagination.pageSize !== pageSize) {
        setPageSize(pagination.pageSize || 10);
      }

      const newFilters = { ...filters };
      if (tableFilters.activityType) {
        newFilters.activityType = tableFilters.activityType[0] as ActivityTypeValue;
      }
      if (tableFilters.status) {
        newFilters.status = tableFilters.status[0] as ActivityStatusValue;
      }
      if (tableFilters.priority) {
        newFilters.priority = tableFilters.priority[0] as ActivityPriorityValue;
      }
      if (tableFilters.isActive !== undefined && tableFilters.isActive !== null) {
        newFilters.isActive = tableFilters.isActive[0] as boolean;
      }
      setFilters(newFilters);
    },
    [page, pageSize, filters, setPage, setPageSize, setFilters]
  );

  // Calendar date cell render
  const calendarDateCellRender = useCallback(
    (value: Dayjs) => {
      const dateStr = value.format('YYYY-MM-DD');
      const dayActivities = calendarActivities.filter((activity) => {
        const activityDate = activity.dueDate
          ? dayjs(activity.dueDate).format('YYYY-MM-DD')
          : null;
        return activityDate === dateStr;
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
                  style={{ cursor: 'pointer', padding: '4px 0' }}
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
                      <Text ellipsis style={{ maxWidth: 200, display: 'block' }}>
                        {item.subject}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {dayjs(item.dueDate).format('HH:mm')} - {getActivityStatusLabel(item.status)}
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
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {dayActivities.slice(0, 3).map((activity) => (
              <li key={activity.id} style={{ marginBottom: 2 }}>
                <Badge
                  color={getActivityTypeColor(activity.activityType)}
                  text={
                    <Text ellipsis style={{ fontSize: 11, maxWidth: 80, display: 'inline-block' }}>
                      {activity.subject}
                    </Text>
                  }
                />
              </li>
            ))}
            {dayActivities.length > 3 && (
              <li>
                <Text type="secondary" style={{ fontSize: 10 }}>
                  +{dayActivities.length - 3} daha
                </Text>
              </li>
            )}
          </ul>
        </Popover>
      );
    },
    [calendarActivities, handleView]
  );

  // Calendar header render - MEMOIZED
  const calendarHeaderRender = useCallback(
    ({ value, onChange }: { value: Dayjs; onChange: (date: Dayjs) => void }) => {
      const handlePrevMonth = () => {
        const newDate = value.subtract(1, 'month');
        onChange(newDate);
        setCalendarDate(newDate.toDate());
      };

      const handleNextMonth = () => {
        const newDate = value.add(1, 'month');
        onChange(newDate);
        setCalendarDate(newDate.toDate());
      };

      const handleToday = () => {
        const today = dayjs();
        onChange(today);
        setCalendarDate(today.toDate());
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
              }
            }}
            format="MMMM YYYY"
            allowClear={false}
          />
        </Flex>
      );
    },
    [setCalendarDate]
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
          loading={loading}
          rowSelection={rowSelection}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} kayıt`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: { cursor: 'pointer' },
          })}
          scroll={{ x: 1100 }}
          size="middle"
        />
      </Card>
    </>
  );

  // Render Calendar View
  const renderCalendarView = () => (
    <Card styles={{ body: { padding: 0 } }} loading={calendarLoading}>
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
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleRefresh}
                  loading={loading || calendarLoading}
                />
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

export default ActivityList;
