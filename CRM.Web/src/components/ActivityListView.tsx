import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/config/route.paths';
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
  Tooltip,
  Typography,
  Flex,
  DatePicker,
  Modal,
  Avatar,
} from 'antd';
import type { ColumnsType, TableRowSelection } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import {
  DeleteOutlined,
  FilterOutlined,
  ReloadOutlined,
  MoreOutlined,
  SearchOutlined,
  ClearOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FlagOutlined,
  CloseCircleOutlined,
  EditOutlined,
  UserOutlined,
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
import CustomPagination from '@/components/CustomPagination';
import activityService from '@/services/activity.service';
import { handleError } from '@/hooks/useHandleError';
import { StateType, useProcessState } from '@/stores/process.state.store';

const { Text } = Typography;
const { Search } = Input;

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

export interface ActivityListViewProps {
  // Initial filters (örn: LeadDetail'den regardingEntityId gelebilir)
  initialFilters?: Partial<ActivityListFilters>;
  
  // UI options
  showFilters?: boolean;
  showBulkActions?: boolean;
  showPagination?: boolean;
}

const ActivityListView: React.FC<ActivityListViewProps> = ({
  initialFilters = {},
  showFilters = true,
  showBulkActions = true,
  showPagination = true,
}) => {
  const navigate = useNavigate();

  // ========== COMPONENT STATE ==========
  const [activities, setActivities] = useState<ActivityListItem[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<ActivityListFilters>({
    ...initialFilters,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchText, setSearchText] = useState(filters.subject || '');

  // ========== DATA FETCHING ==========

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
      const errorMessage = handleError(error);
      setState(StateType.Error, 'Aktivite listesi yüklenemedi', errorMessage);
    } finally {
      isFetching.current = false;
    }
  }, [page, pageSize, filters]);

  // Initial fetch ve filter değişimlerinde fetch
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchActivities(); // Sadece mount'ta
    }
  }, []);

  useEffect(() => {
    if (!isFirstRender.current) {
      fetchActivities();
    }
  }, [page, pageSize, JSON.stringify(filters)]);

  // Reset state when component unmounts or initialFilters change
  const initialFiltersRef = useRef(JSON.stringify(initialFilters));

  useEffect(() => {
    const current = JSON.stringify(initialFilters);
    if (initialFiltersRef.current !== current) {
      initialFiltersRef.current = current;
      setFilters({ ...initialFilters });
      setPage(1);
      // fetchActivities ÇAĞRILMAYACAK - yukarıdaki useEffect handle edecek
    }
  }, [JSON.stringify(initialFilters)]);

  // ========== HANDLERS ==========
  
  // Handle row click
  const handleRowClick = useCallback(
    (record: ActivityListItem) => {
      const path = getActivityDetailPath(record.activityType, record.id, 'view');
      navigate(path);
    },
    [navigate]
  );

  // Handle view
  const handleView = useCallback(
    (record: ActivityListItem, e: React.MouseEvent) => {
      e.stopPropagation();
      const path = getActivityDetailPath(record.activityType, record.id, 'edit');
      navigate(path);
    },
    [navigate]
  );

  // Handle search
  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
    setFilters(prev => ({
      ...prev,
      subject: value || undefined,
    }));
    setPage(1);
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value === '' || value === null ? undefined : value,
    }));
    setPage(1);
  }, []);

  // Handle reset filters
  const handleResetFilters = useCallback(() => {
    setFilters({ ...initialFilters });
    setSearchText('');
    setPage(1);
  }, [initialFilters]);

  // Handle pagination
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  }, []);

  // Handle bulk delete
  const handleBulkDelete = useCallback(async () => {
    Modal.confirm({
      title: 'Toplu Silme',
      content: `Seçili ${selectedRowKeys.length} aktivite silinecek. Onaylıyor musunuz?`,
      okText: 'Sil',
      okType: 'danger',
      cancelText: 'İptal',
      onOk: async () => {
        const { setState } = useProcessState.getState();
        try {
          setState(StateType.Loading, 'Aktiviteler siliniyor...', 'Lütfen bekleyiniz...');
          await activityService.bulkDeleteActivities(selectedRowKeys);
          setSelectedRowKeys([]);
          fetchActivities();
        } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, 'Aktiviteler silinemedi', errorMessage);
        }
      },
    });
  }, [selectedRowKeys, fetchActivities]);

  // Handle bulk status update
  const handleBulkStatusUpdate = useCallback(
    async (status: ActivityStatusValue) => {
      const { setState } = useProcessState.getState();
      try {
        setState(StateType.Loading, 'Aktiviteler güncelleniyor...', 'Lütfen bekleyiniz...');
        await activityService.bulkUpdateStatus(selectedRowKeys, status);
        setSelectedRowKeys([]);
        fetchActivities();
      } catch (error) {
        const errorMessage = handleError(error);
        setState(StateType.Error, 'Aktiviteler güncellenemedi', errorMessage);
      }
    },
    [selectedRowKeys, fetchActivities]
  );

  // ========== Entity Helper ==========/


  // ========== TABLE COLUMNS ==========
  const columns: ColumnsType<ActivityListItem> = useMemo(
    () => [
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
                    color:getActivityTypeColor(record.activityType),
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
          const dateToUse =
            record.status === ActivityStatus.Completed
              ? record.endDate
              : record.dueDate;

          if (!dateToUse) return '-';

          const date = dayjs(dateToUse);

          const isOverdue =
            record.status !== ActivityStatus.Completed &&
            date.isBefore(dayjs(), 'day');

          const isToday =
            record.status !== ActivityStatus.Completed &&
            date.isSame(dayjs(), 'day');

          return (
            <Space>
              <ClockCircleOutlined
                style={{
                  color: isOverdue
                    ? '#ff4d4f'
                    : isToday
                    ? '#faad14'
                    : '#8c8c8c',
                }}
              />
              <Text type={isOverdue ? 'danger' : undefined}>
                {date.format('DD.MM.YYYY HH:mm')}
              </Text>
            </Space>
          );
        },
      },
      {
        title: 'Sahibi',
        key: 'owner',
        width: '10%',
        fixed: 'right',
        render: (_: any, record: ActivityListItem) => (
        <Space orientation='horizontal'>
          <Avatar
                  size="small"
                  style={{
                    backgroundColor: 'transparent',
                    color: '#1890ff',
                    fontSize: 14,
                  }}
                  icon={<UserOutlined />}
                />
              <Text>{record.owner?.name || 'Bilinmeyen Sahip'}</Text>
              </Space>
        ),
      },
      {
        title: 'İşlemler',
        key: 'actions',
        width: '5%',
        fixed: 'right',
        render: (_: any, record: ActivityListItem) => (
          <Space>
            <Tooltip title="Düzenle">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={(e) => handleView(record, e)}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [handleView]
  );

  // Row selection
  const rowSelection: TableRowSelection<ActivityListItem> | undefined = showBulkActions
    ? {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys as string[]),
      }
    : undefined;

  // Bulk action menu items
  const bulkActionItems = useMemo(
    () => [
      {
        key: 'complete',
        label: 'Tamamlandı Olarak İşaretle',
        icon: <CheckCircleOutlined />,
        onClick: () => handleBulkStatusUpdate(ActivityStatus.Completed),
      },
      {
        key: 'cancel',
        label: 'İptal Et',
        icon: <CloseCircleOutlined />,
        onClick: () => handleBulkStatusUpdate(ActivityStatus.Cancelled),
      },
      { type: 'divider' as const },
      {
        key: 'delete',
        label: 'Sil',
        icon: <DeleteOutlined />,
        danger: true,
        onClick: handleBulkDelete,
      },
    ],
    [handleBulkStatusUpdate, handleBulkDelete]
  );

  return (
    <>
      {/* Bulk Actions Bar */}
      {showBulkActions && selectedRowKeys.length > 0 && (
        <Card
          style={{ marginBottom: 16, background: '#e6f7ff', borderColor: '#91d5ff' }}
          styles={{ body: { padding: '12px 24px' } }}
        >
          <Flex justify="space-between" align="center">
            <Space>
              <Text strong>{selectedRowKeys.length} öğe seçildi</Text>
              <Button type="link" size="small" onClick={() => setSelectedRowKeys([])}>
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
                    <DatePicker.RangePicker
                      placeholder={['Başlangıç', 'Bitiş']}
                      style={{ width: 240 }}
                      value={
                        filters.dueDateFrom && filters.dueDateTo
                          ? [dayjs(filters.dueDateFrom), dayjs(filters.dueDateTo)]
                          : null
                      }
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
                    <Button icon={<ClearOutlined />} onClick={handleResetFilters} />
                  </Tooltip>
                )}
                <Tooltip title="Yenile">
                  <Button icon={<ReloadOutlined />} onClick={fetchActivities} />
                </Tooltip>
              </Space>
            </Col>
          </Row>
        </Card>
      )}

      {/* Table */}
      <Card styles={{ body: { padding: 0 } }}>
        <Table<ActivityListItem>
          rowKey="id"
          columns={columns}
          dataSource={activities}
          loading={false}
          rowSelection={rowSelection}
          pagination={false}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: { cursor: 'pointer' },
          })}
          scroll={{ x: 1100 }}
          size="middle"
        />

        {/* Custom Pagination */}
        {showPagination && (
          <CustomPagination
            current={page}
            pageSize={pageSize}
            hasMore={hasMore}
            totalItems={activities?.length ?? 0}
            pageSizeOptions={[2,10, 20, 50, 100]}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </Card>
    </>
  );
};

export default ActivityListView;