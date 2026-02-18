import { useEffect, useState, useCallback, useRef } from 'react';
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
  Modal,
  Tooltip,
  Badge,
  Typography,
  Flex,
} from 'antd';
import type { TableProps, MenuProps } from 'antd';
import type { ColumnsType, TableRowSelection } from 'antd/es/table/interface';
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
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';
import type { LeadListItem, LeadStatusValue, LeadRatingValue, LeadSourceValue } from '@/types/lead.types';
import {
  LeadStatus,
  getLeadStatusLabel,
  getLeadSourceLabel,
  getLeadRatingLabel,
  getLeadStatusColor,
  getLeadRatingColor,
  leadStatusOptions,
  leadRatingOptions,
  leadSourceOptions,
  leadStatusFilters,
  leadRatingFilters,
} from '@/types/lead.types';
import { useLeadStore } from '@/stores/lead.store';
import leadService from '@/services/lead.service';
import CustomPagination from '@/components/CustomPagination';
import { handleError } from '@/hooks/useHandleError';
import { StateType, useProcessState } from "@/stores/process.state.store";

const { Title, Text } = Typography;
const { Search } = Input;

const LeadList: React.FC = () => {
  const navigate = useNavigate();
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  

  // Store state and actions
  const {
    leads,
    hasMore,
    page,
    pageSize,
    filters,
    selectedRowKeys,
    fetchLeads,
    setPagination,
    setFilters,
    resetFilters,
    setSelectedRowKeys,
    clearSelectedRowKeys,
    bulkDeleteLeads,
    bulkUpdateStatus,
  } = useLeadStore();

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchLeads();
    }
  }, [fetchLeads]);


  // Handle row click - navigate to detail/edit page
  const handleRowClick = useCallback(
    (record: LeadListItem) => {
      navigate(RoutePaths.Lead.View(record.id));
    },
    [navigate]
  );

  // Handle view (read mode)
  const handleView = useCallback(
    (record: LeadListItem) => {
      navigate(RoutePaths.Lead.View(record.id));
    },
    [navigate]
  );
  
  // Handle edit
  const handleEdit = useCallback(
    (record: LeadListItem) => {
      navigate(RoutePaths.Lead.Edit(record.id));
    },
    [navigate]
  );

  // Handle create new lead
  const handleCreate = useCallback(() => {
    navigate(RoutePaths.Lead.New);
  }, [navigate]);

  // Handle search
  const handleSearch = useCallback(
    (value: string) => {
      setSearchText(value);
      setFilters({
        ...filters,
        companyName: value || undefined,
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
      content: `Seçili ${selectedRowKeys.length} lead silinecek. Onaylıyor musunuz?`,
      okText: 'Sil',
      okType: 'danger',
      cancelText: 'İptal',
      onOk: async () => {
         
          await bulkDeleteLeads();
      },
    });
  }, [selectedRowKeys.length, bulkDeleteLeads]);

  // Handle bulk status update
  const handleBulkStatusUpdate = useCallback(
    async (status: LeadStatusValue) => {
        
        await bulkUpdateStatus(status);
    },
    [selectedRowKeys.length, bulkUpdateStatus]
  );

  // Handle export
  const handleExport = useCallback(async () => {
    
    const { setState } = useProcessState.getState();

    try {
      setState(StateType.Loading, "Dışa Aktarılıyor", "Lead listesi hazırlanıyor...");
    
      const blob = await leadService.exportLeads(filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `leads_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      setState(StateType.Success, "Dışa Aktarıldı", "Lead listesi dışa aktarıldı");
      
   } catch (error) {
          const errorMessage = handleError(error);
          setState(StateType.Error, "Lead listesi dışa aktarılamadı", errorMessage);
  }
  }, [filters]);

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

  // Bulk action menu items
  const bulkActionItems: MenuProps['items'] = [
    {
      key: 'status',
      label: 'Durum Değiştir',
      icon: <CheckCircleOutlined />,
      children: [
        {
          key: `status-${LeadStatus.New}`,
          label: getLeadStatusLabel(LeadStatus.New),
          onClick: () => handleBulkStatusUpdate(LeadStatus.New),
        },
        {
          key: `status-${LeadStatus.Contacted}`,
          label: getLeadStatusLabel(LeadStatus.Contacted),
          onClick: () => handleBulkStatusUpdate(LeadStatus.Contacted),
        },
        {
          key: `status-${LeadStatus.Qualified}`,
          label: getLeadStatusLabel(LeadStatus.Qualified),
          onClick: () => handleBulkStatusUpdate(LeadStatus.Qualified),
        },
        {
          key: `status-${LeadStatus.Unqualified}`,
          label: getLeadStatusLabel(LeadStatus.Unqualified),
          onClick: () => handleBulkStatusUpdate(LeadStatus.Unqualified),
        },
      ],
    },
    { type: 'divider' },
    {
      key: 'delete',
      label: 'Seçilenleri Sil',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: handleBulkDelete,
    },
  ];

  // Row action menu
  const getRowActionItems = (record: LeadListItem): MenuProps['items'] => [
    {
      key: 'view',
      label: 'Görüntüle',
      icon: <UserOutlined />,
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
        handleEdit(record);
      },
    },
    { type: 'divider' },
    {
      key: 'delete',
      label: 'Sil',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: (info) => {
        info.domEvent.stopPropagation();

      const { setState } = useProcessState.getState();

        Modal.confirm({
          title: 'Lead Silme',
          content: `"${record.companyName}" lead'i silinecek. Onaylıyor musunuz?`,
          okText: 'Sil',
          okType: 'danger',
          cancelText: 'İptal',
          onOk: async () => {
            try {
             
              await leadService.deleteLead(record.id);
             
            } catch (error) {
              const errorMessage = handleError(error);
              setState(StateType.Error, "Silme Başarısız", errorMessage);
            }
          },
        });
      },
    },
  ];

  // Table columns
  const columns: ColumnsType<LeadListItem> = [
    {
      title: 'Şirket Adı',
      dataIndex: 'companyName',
      key: 'companyName',
      sorter: true,
      width: 200,
      render: (text: string, record: LeadListItem) => (
        <Space orientation="vertical" size={0}>
          <Text strong style={{ cursor: 'pointer', color: '#1890ff' }}>
            {text}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.firstName} {record.lastName}
          </Text>
        </Space>
      ),
    },
    {
      title: 'İletişim',
      dataIndex: 'email',
      key: 'contact',
      width: 220,
      render: (_: unknown, record: LeadListItem) => (
        <Space orientation="vertical" size={2}>
          {record.email && (
            <Space size={4}>
              <MailOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
              <Text style={{ fontSize: 13 }}>{record.email}</Text>
            </Space>
          )}
          {record.mobilePhone && (
            <Space size={4}>
              <PhoneOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
              <Text style={{ fontSize: 13 }}>{record.mobilePhone}</Text>
            </Space>
          )}
        </Space>
      ),
    },
    {
      title: 'Durum',
      dataIndex: 'leadStatus',
      key: 'leadStatus',
      width: 140,
      filters: leadStatusFilters,
      render: (status: LeadStatusValue) => (
        <Tag color={getLeadStatusColor(status)}>{getLeadStatusLabel(status)}</Tag>
      ),
    },
    {
      title: 'Değerlendirme',
      dataIndex: 'leadRating',
      key: 'leadRating',
      width: 120,
      filters: leadRatingFilters,
      render: (rating: LeadRatingValue) => (
        <Tag color={getLeadRatingColor(rating)}>{getLeadRatingLabel(rating)}</Tag>
      ),
    },
    {
      title: 'Kaynak',
      dataIndex: 'leadSource',
      key: 'leadSource',
      width: 120,
      render: (source: LeadSourceValue) => <Text>{getLeadSourceLabel(source)}</Text>,
    },
    {
      title: 'Sektör',
      dataIndex: 'industry',
      key: 'industry',
      width: 140,
      ellipsis: true,
    },
    {
      title: 'Tahmini Değer',
      dataIndex: 'estimatedValue',
      key: 'estimatedValue',
      width: 130,
      align: 'right',
      sorter: true,
      render: (value: number) =>
        value ? `₺${value.toLocaleString('tr-TR')}` : '-',
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
      render: (_: unknown, record: LeadListItem) => (
        <Dropdown menu={{ items: getRowActionItems(record) }} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
        </Dropdown>
      ),
    },
  ];

  // Row selection config
  const rowSelection: TableRowSelection<LeadListItem> = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys as string[]),
    preserveSelectedRowKeys: true,
  };

  // Table change handler - sadece filter değişikliklerini handle ediyor
  const handleTableChange: TableProps<LeadListItem>['onChange'] = (_pagination, tableFilters) => {
    const newFilters = { ...filters };

    if (tableFilters.leadStatus) {
      newFilters.leadStatus = tableFilters.leadStatus[0] as LeadStatusValue;
    } else {
      newFilters.leadStatus = undefined;
    }

    if (tableFilters.leadRating) {
      newFilters.leadRating = tableFilters.leadRating[0] as LeadRatingValue;
    } else {
      newFilters.leadRating = undefined;
    }

    if (tableFilters.isActive !== undefined && tableFilters.isActive !== null && tableFilters.isActive.length > 0) {
      newFilters.isActive = tableFilters.isActive[0] as boolean;
    } else {
      newFilters.isActive = undefined;
    }

    setFilters(newFilters);
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Page Header */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Lead Yönetimi
          </Title>
          <Text type="secondary">Potansiyel müşterilerinizi yönetin</Text>
        </div>
        <Space>
          <Button icon={<ExportOutlined />} onClick={handleExport}>
            Dışa Aktar
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Yeni Lead
          </Button>
        </Space>
      </Flex>

      {/* Filters Card */}
      <Card style={{ marginBottom: 16 }} styles={{ body: { padding: '16px 24px' } }}>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <Space size="middle" wrap>
              <Search
                placeholder="Şirket adı ara..."
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
                    placeholder="Durum"
                    allowClear
                    style={{ width: 160 }}
                    value={filters.leadStatus}
                    onChange={(value) => handleFilterChange('leadStatus', value)}
                    options={leadStatusOptions}
                  />

                  <Select
                    placeholder="Değerlendirme"
                    allowClear
                    style={{ width: 140 }}
                    value={filters.leadRating}
                    onChange={(value) => handleFilterChange('leadRating', value)}
                    options={leadRatingOptions}
                  />

                  <Select
                    placeholder="Kaynak"
                    allowClear
                    style={{ width: 150 }}
                    value={filters.leadSource}
                    onChange={(value) => handleFilterChange('leadSource', value)}
                    options={leadSourceOptions}
                  />

                  <Input
                    placeholder="Sektör"
                    allowClear
                    style={{ width: 150 }}
                    value={filters.industry || ''}
                    onChange={(e) => handleFilterChange('industry', e.target.value)}
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

              {(filters.companyName ||
                filters.leadStatus !== undefined ||
                filters.leadRating !== undefined ||
                filters.leadSource !== undefined ||
                filters.industry) && (
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
                <Button icon={<ReloadOutlined />} onClick={() => fetchLeads()} />
              </Tooltip>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Bulk Actions Bar */}
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

      {/* Data Table */}
      <Card styles={{ body: { padding: 0 } }}>
        <Table<LeadListItem>
          rowKey="id"
          columns={columns}
          dataSource={leads}
          loading={false}
          rowSelection={rowSelection}
          pagination={false}
          onChange={handleTableChange}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: { cursor: 'pointer' },
          })}
          scroll={{ x: 1300 }}
          size="middle"
        />

        {/* Custom Pagination */}
        <CustomPagination
          current={page}
          pageSize={pageSize}
          hasMore={hasMore}
          totalItems={leads?.length ?? 0}
          pageSizeOptions={[10, 20, 50, 100]}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </Card>
    </div>
  );
};

export default LeadList;