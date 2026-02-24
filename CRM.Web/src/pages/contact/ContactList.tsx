import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/config/route.paths';
import {
  Table,
  Card,
  Button,
  Space,
  Input,
  Row,
  Col,
  Dropdown,
  Modal,
  Tooltip,
  Badge,
  Typography,
  Flex,
  Avatar,
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
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  BankOutlined,
} from '@ant-design/icons';
import type { ContactAccountRef, ContactListItem } from '@/types/contact.types';
import { useContactStore } from '@/stores/contact.store';
import contactService from '@/services/contact.service';
import CustomPagination from '@/components/CustomPagination';
import { handleError } from '@/hooks/useHandleError';
import { StateType, useProcessState } from '@/stores/process.state.store';

const { Title, Text } = Typography;
const { Search } = Input;

const ContactList: React.FC = () => {
  const navigate = useNavigate();
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const {
    contacts,
    hasMore,
    page,
    pageSize,
    filters,
    selectedRowKeys,
    fetchContacts,
    setPagination,
    setFilters,
    resetFilters,
    setSelectedRowKeys,
    clearSelectedRowKeys,
    bulkDeleteContacts,
  } = useContactStore();

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchContacts();
    }
  }, [fetchContacts]);

  const handleRowClick = useCallback(
    (record: ContactListItem) => {
      navigate(RoutePaths.Contact.View(record.id));
    },
    [navigate]
  );

  const handleView = useCallback(
    (record: ContactListItem) => {
      navigate(RoutePaths.Contact.View(record.id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (record: ContactListItem) => {
      navigate(RoutePaths.Contact.Edit(record.id));
    },
    [navigate]
  );

  const handleCreate = useCallback(() => {
    navigate(RoutePaths.Contact.New);
  }, [navigate]);

  const handleSearch = useCallback(
    (value: string) => {
      setSearchText(value);
      setFilters({ ...filters, contactName: value || undefined });
    },
    [filters, setFilters]
  );

  const handleFilterChange = useCallback(
    (field: string, value: unknown) => {
      setFilters({
        ...filters,
        [field]: value === '' || value === null ? undefined : value,
      });
    },
    [filters, setFilters]
  );

  const handleBulkDelete = useCallback(() => {
    Modal.confirm({
      title: 'Toplu Silme',
      content: `Seçili ${selectedRowKeys.length} kişi silinecek. Onaylıyor musunuz?`,
      okText: 'Sil',
      okType: 'danger',
      cancelText: 'İptal',
      onOk: async () => {
        await bulkDeleteContacts();
      },
    });
  }, [selectedRowKeys.length, bulkDeleteContacts]);

  const handleExport = useCallback(async () => {
    const { setState } = useProcessState.getState();

    try {
      setState(StateType.Loading, 'Dışa Aktarılıyor', 'Kişi listesi hazırlanıyor...');

      const blob = await contactService.exportContacts(filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contacts_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);

      setState(StateType.Success, 'Dışa Aktarıldı', 'Kişi listesi dışa aktarıldı');
    } catch (error) {
      const errorMessage = handleError(error);
      setState(StateType.Error, 'Kişi listesi dışa aktarılamadı', errorMessage);
    }
  }, [filters]);

  const handlePageChange = useCallback(
    (newPage: number) => setPagination({ page: newPage }),
    [setPagination]
  );

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => setPagination({ pageSize: newPageSize }),
    [setPagination]
  );

  const bulkActionItems: MenuProps['items'] = [
    {
      key: 'delete',
      label: 'Seçilenleri Sil',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: handleBulkDelete,
    },
  ];

  const getRowActionItems = (record: ContactListItem): MenuProps['items'] => [
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
          title: 'Kişi Silme',
          content: `"${record.fullName}" kişisi silinecek. Onaylıyor musunuz?`,
          okText: 'Sil',
          okType: 'danger',
          cancelText: 'İptal',
          onOk: async () => {
            try {
              await contactService.deleteContact(record.id);
              await fetchContacts();
            } catch (error) {
              const errorMessage = handleError(error);
              setState(StateType.Error, 'Silme Başarısız', errorMessage);
            }
          },
        });
      },
    },
  ];

  const columns: ColumnsType<ContactListItem> = [
    {
      title: 'Kişi',
      key: 'fullName',
      sorter: true,
      width: 240,
      render: (_: unknown, record: ContactListItem) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <Space orientation="vertical" size={0}>
            <Text strong style={{ cursor: 'pointer', color: '#1890ff' }}>
              {record.fullName}
            </Text>
            {record.title && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.title}
              </Text>
            )}
          </Space>
        </Space>
      ),
    },
    {
      title: 'Firma',
      dataIndex: 'primaryAccount',
      key: 'primaryAccount',
      width: 180,
      ellipsis: true,
      render: (primaryAccount: ContactAccountRef) =>
        primaryAccount ? (
          <Space size={4}>
            <BankOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
            <Text>{primaryAccount.accountName}</Text>
          </Space>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: 'Departman',
      dataIndex: 'department',
      key: 'department',
      width: 140,
      ellipsis: true,
      render: (value: string) => value || <Text type="secondary">-</Text>,
    },
    {
      title: 'İletişim',
      key: 'contact',
      width: 220,
      render: (_: unknown, record: ContactListItem) => (
        <Space orientation="vertical" size={2}>
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
          <Text type="secondary">-</Text>
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
      render: (_: unknown, record: ContactListItem) => (
        <Dropdown menu={{ items: getRowActionItems(record) }} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
        </Dropdown>
      ),
    },
  ];

  const rowSelection: TableRowSelection<ContactListItem> = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys as string[]),
    preserveSelectedRowKeys: true,
  };

  const handleTableChange: TableProps<ContactListItem>['onChange'] = (
    _pagination,
    tableFilters
  ) => {
    const newFilters = { ...filters };

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

  const hasActiveFilters =
    !!filters.contactName ||
    !!filters.accountId ||
    !!filters.title ||
    !!filters.department;

  return (
    <div style={{ padding: 24 }}>
      {/* Page Header */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Kişi Yönetimi
          </Title>
          <Text type="secondary">Kişilerinizi yönetin</Text>
        </div>
        <Space>
          <Button icon={<ExportOutlined />} onClick={handleExport}>
            Dışa Aktar
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Yeni Kişi
          </Button>
        </Space>
      </Flex>

      {/* Filters Card */}
      <Card style={{ marginBottom: 16 }} styles={{ body: { padding: '16px 24px' } }}>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <Space size="middle" wrap>
              <Search
                placeholder="Kişi adı ara..."
                allowClear
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={handleSearch}
                style={{ width: 280 }}
                prefix={<SearchOutlined />}
              />

              {filterVisible && (
                <>
                  <Input
                    placeholder="Unvan"
                    allowClear
                    style={{ width: 150 }}
                    value={filters.title || ''}
                    onChange={(e) => handleFilterChange('title', e.target.value)}
                  />
                  <Input
                    placeholder="Departman"
                    allowClear
                    style={{ width: 150 }}
                    value={filters.department || ''}
                    onChange={(e) => handleFilterChange('department', e.target.value)}
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

              {hasActiveFilters && (
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
                <Button icon={<ReloadOutlined />} onClick={() => fetchContacts()} />
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
            <Dropdown menu={{ items: bulkActionItems }} trigger={['click']}>
              <Button type="primary">
                <Space>
                  Toplu İşlemler
                  <MoreOutlined />
                </Space>
              </Button>
            </Dropdown>
          </Flex>
        </Card>
      )}

      {/* Data Table */}
      <Card styles={{ body: { padding: 0 } }}>
        <Table<ContactListItem>
          rowKey="id"
          columns={columns}
          dataSource={contacts}
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

        <CustomPagination
          current={page}
          pageSize={pageSize}
          hasMore={hasMore}
          totalItems={contacts?.length ?? 0}
          pageSizeOptions={[10, 20, 50, 100]}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </Card>
    </div>
  );
};

export default ContactList;
