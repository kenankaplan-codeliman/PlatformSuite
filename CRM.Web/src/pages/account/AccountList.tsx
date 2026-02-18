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
  BankOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import type { AccountListItem, AccountTypeValue } from '@/types/account.types';
import {
  getAccountTypeLabel,
  getAccountTypeColor,
  accountTypeOptions,
  accountTypeFilters,
} from '@/types/account.types';
import { useAccountStore } from '@/stores/account.store';
import accountService from '@/services/account.service';
import CustomPagination from '@/components/CustomPagination';
import { handleError } from '@/hooks/useHandleError';
import { StateType, useProcessState } from '@/stores/process.state.store';

const { Title, Text } = Typography;
const { Search } = Input;

const AccountList: React.FC = () => {
  const navigate = useNavigate();
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Store state and actions
  const {
    accounts,
    hasMore,
    page,
    pageSize,
    filters,
    selectedRowKeys,
    fetchAccounts,
    setPagination,
    setFilters,
    resetFilters,
    setSelectedRowKeys,
    clearSelectedRowKeys,
    bulkDeleteAccounts,
  } = useAccountStore();

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchAccounts();
    }
  }, [fetchAccounts]);

  // Handle row click - navigate to detail/edit page
  const handleRowClick = useCallback(
    (record: AccountListItem) => {
      navigate(RoutePaths.Account.View(record.id));
    },
    [navigate]
  );

  // Handle view (read mode)
  const handleView = useCallback(
    (record: AccountListItem) => {
      navigate(RoutePaths.Account.View(record.id));
    },
    [navigate]
  );

  // Handle edit
  const handleEdit = useCallback(
    (record: AccountListItem) => {
      navigate(RoutePaths.Account.Edit(record.id));
    },
    [navigate]
  );

  // Handle create new account
  const handleCreate = useCallback(() => {
    navigate(RoutePaths.Account.New);
  }, [navigate]);

  // Handle search
  const handleSearch = useCallback(
    (value: string) => {
      setSearchText(value);
      setFilters({
        ...filters,
        accountName: value || undefined,
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
      content: `Seçili ${selectedRowKeys.length} firma silinecek. Onaylıyor musunuz?`,
      okText: 'Sil',
      okType: 'danger',
      cancelText: 'İptal',
      onOk: async () => {
        await bulkDeleteAccounts();
      },
    });
  }, [selectedRowKeys.length, bulkDeleteAccounts]);

  // Handle export
  const handleExport = useCallback(async () => {
    const { setState } = useProcessState.getState();

    try {
      setState(StateType.Loading, 'Dışa Aktarılıyor', 'Firma listesi hazırlanıyor...');

      const blob = await accountService.exportAccounts(filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `accounts_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);

      setState(StateType.Success, 'Dışa Aktarıldı', 'Firma listesi dışa aktarıldı');
    } catch (error) {
      const errorMessage = handleError(error);
      setState(StateType.Error, 'Firma listesi dışa aktarılamadı', errorMessage);
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
      key: 'delete',
      label: 'Seçilenleri Sil',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: handleBulkDelete,
    },
  ];

  // Row action menu
  const getRowActionItems = (record: AccountListItem): MenuProps['items'] => [
    {
      key: 'view',
      label: 'Görüntüle',
      icon: <BankOutlined />,
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
          title: 'Firma Silme',
          content: `"${record.accountName}" firması silinecek. Onaylıyor musunuz?`,
          okText: 'Sil',
          okType: 'danger',
          cancelText: 'İptal',
          onOk: async () => {
            try {
              await accountService.deleteAccount(record.id);
              await fetchAccounts();
            } catch (error) {
              const errorMessage = handleError(error);
              setState(StateType.Error, 'Silme Başarısız', errorMessage);
            }
          },
        });
      },
    },
  ];

  // Table columns
  const columns: ColumnsType<AccountListItem> = [
    {
      title: 'Firma Adı',
      dataIndex: 'accountName',
      key: 'accountName',
      sorter: true,
      width: 220,
      render: (text: string) => (
        <Text strong style={{ cursor: 'pointer', color: '#1890ff' }}>
          {text}
        </Text>
      ),
    },
    {
      title: 'Tip',
      dataIndex: 'accountType',
      key: 'accountType',
      width: 120,
      filters: accountTypeFilters,
      render: (type: AccountTypeValue) => (
        <Tag color={getAccountTypeColor(type)}>{getAccountTypeLabel(type)}</Tag>
      ),
    },
    {
      title: 'İletişim',
      key: 'contact',
      width: 220,
      render: (_: unknown, record: AccountListItem) => (
        <Space direction="vertical" size={2}>
          {record.primaryEmail && (
            <Space size={4}>
              <MailOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
              <Text style={{ fontSize: 13 }}>{record.primaryEmail}</Text>
            </Space>
          )}
          {record.primaryPhone && (
            <Space size={4}>
              <PhoneOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
              <Text style={{ fontSize: 13 }}>{record.primaryPhone}</Text>
            </Space>
          )}
        </Space>
      ),
    },
    {
      title: 'Sektör',
      dataIndex: 'industry',
      key: 'industry',
      width: 140,
      ellipsis: true,
    },
    {
      title: 'Şehir',
      dataIndex: 'primaryCity',
      key: 'primaryCity',
      width: 120,
      ellipsis: true,
      render: (city: string) =>
        city ? (
          <Space size={4}>
            <EnvironmentOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
            <Text>{city}</Text>
          </Space>
        ) : (
          '-'
        ),
    },
    {
      title: 'Çalışan',
      dataIndex: 'numberOfEmployees',
      key: 'numberOfEmployees',
      width: 100,
      align: 'right',
      sorter: true,
      render: (value: number) => (value ? value.toLocaleString('tr-TR') : '-'),
    },
    {
      title: 'Yıllık Gelir',
      dataIndex: 'annualRevenue',
      key: 'annualRevenue',
      width: 140,
      align: 'right',
      sorter: true,
      render: (value: number) => (value ? `₺${value.toLocaleString('tr-TR')}` : '-'),
    },
    {
      title: 'Web',
      dataIndex: 'website',
      key: 'website',
      width: 60,
      align: 'center',
      render: (url: string) =>
        url ? (
          <Tooltip title={url}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <GlobalOutlined style={{ color: '#1890ff' }} />
            </a>
          </Tooltip>
        ) : (
          '-'
        ),
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
      render: (_: unknown, record: AccountListItem) => (
        <Dropdown menu={{ items: getRowActionItems(record) }} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
        </Dropdown>
      ),
    },
  ];

  // Row selection config
  const rowSelection: TableRowSelection<AccountListItem> = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys as string[]),
    preserveSelectedRowKeys: true,
  };

  // Table change handler - sadece filter değişikliklerini handle ediyor
  const handleTableChange: TableProps<AccountListItem>['onChange'] = (
    _pagination,
    tableFilters
  ) => {
    const newFilters = { ...filters };

    if (tableFilters.accountType) {
      newFilters.accountType = tableFilters.accountType[0] as AccountTypeValue;
    } else {
      newFilters.accountType = undefined;
    }

    if (
      tableFilters.isActive !== undefined &&
      tableFilters.isActive !== null &&
      tableFilters.isActive.length > 0
    ) {
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
            Firma Yönetimi
          </Title>
          <Text type="secondary">Firmalarınızı yönetin</Text>
        </div>
        <Space>
          <Button icon={<ExportOutlined />} onClick={handleExport}>
            Dışa Aktar
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Yeni Firma
          </Button>
        </Space>
      </Flex>

      {/* Filters Card */}
      <Card style={{ marginBottom: 16 }} styles={{ body: { padding: '16px 24px' } }}>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <Space size="middle" wrap>
              <Search
                placeholder="Firma adı ara..."
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
                    placeholder="Firma Tipi"
                    allowClear
                    style={{ width: 160 }}
                    value={filters.accountType}
                    onChange={(value) => handleFilterChange('accountType', value)}
                    options={accountTypeOptions}
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

              {(filters.accountName ||
                filters.accountType !== undefined ||
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
                <Button icon={<ReloadOutlined />} onClick={() => fetchAccounts()} />
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
        <Table<AccountListItem>
          rowKey="id"
          columns={columns}
          dataSource={accounts}
          loading={false}
          rowSelection={rowSelection}
          pagination={false}
          onChange={handleTableChange}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: { cursor: 'pointer' },
          })}
          scroll={{ x: 1400 }}
          size="middle"
        />

        {/* Custom Pagination */}
        <CustomPagination
          current={page}
          pageSize={pageSize}
          hasMore={hasMore}
          totalItems={accounts?.length ?? 0}
          pageSizeOptions={[10, 20, 50, 100]}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </Card>
    </div>
  );
};

export default AccountList;
