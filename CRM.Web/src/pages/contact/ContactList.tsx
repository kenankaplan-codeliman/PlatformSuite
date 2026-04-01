import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RoutePaths } from '@/config/route.paths';
import { Avatar, Badge, Input, Space, Typography } from 'antd';
import type { TableProps } from 'antd';
import type { ColumnsType } from 'antd/es/table/interface';
import { BankOutlined, EnvironmentOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import type { ContactAccountRef, ContactListItem } from '@/types/contact.types';
import { useContactStore } from '@/stores/contact.store';
import ListPageLayout from '@/components/ListPageLayout';

const { Text } = Typography;

const ContactList: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('contact');
  const { t: tc } = useTranslation('common');

  const {
    contacts, hasMore, page, pageSize, filters, selectedRowKeys,
    fetchContacts, setPagination, setFilters, resetFilters,
    setSelectedRowKeys, clearSelectedRowKeys,
    bulkDeleteContacts, bulkActivateContacts, bulkDeactivateContacts, bulkAssignContacts,
    activateContact, deactivateContact, assignContact, deleteContact,
  } = useContactStore();

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; fetchContacts(); }
  }, [fetchContacts]);

  const handleRowClick = useCallback(
    (record: ContactListItem) => navigate(RoutePaths.Contact.View(record.id)),
    [navigate]
  );

  const handleSearch = useCallback(
    (value: string) => setFilters({ ...filters, contactName: value || undefined }),
    [filters, setFilters]
  );

  const handleFilterChange = useCallback(
    (field: string, value: unknown) =>
      setFilters({ ...filters, [field]: value === '' || value === null ? undefined : value }),
    [filters, setFilters]
  );

  const columns: ColumnsType<ContactListItem> = [
    {
      title: t('field.fullName'), key: 'fullName', sorter: true, width: 240,
      render: (_: unknown, record: ContactListItem) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <Space orientation="vertical" size={0}>
            <Text strong style={{ cursor: 'pointer', color: '#1890ff' }}>{record.fullName}</Text>
            {record.title && <Text type="secondary" style={{ fontSize: 12 }}>{record.title}</Text>}
          </Space>
        </Space>
      ),
    },
    {
      title: t('field.company'), dataIndex: 'primaryAccount', key: 'primaryAccount', width: 180, ellipsis: true,
      render: (primaryAccount: ContactAccountRef) => primaryAccount
        ? <Space size={4}><BankOutlined style={{ color: '#8c8c8c', fontSize: 12 }} /><Text>{primaryAccount.accountName}</Text></Space>
        : <Text type="secondary">-</Text>,
    },
    {
      title: t('field.department'), dataIndex: 'department', key: 'department', width: 140, ellipsis: true,
      render: (value: string) => value || <Text type="secondary">-</Text>,
    },
    {
      title: t('section.contactInfo'), key: 'contact', width: 220,
      render: (_: unknown, record: ContactListItem) => (
        <Space orientation="vertical" size={2}>
          {record.primaryEmail && (
            <Space size={4}><MailOutlined style={{ color: '#8c8c8c', fontSize: 12 }} /><Text style={{ fontSize: 13 }}>{record.primaryEmail}</Text></Space>
          )}
          {record.primaryPhone && (
            <Space size={4}><PhoneOutlined style={{ color: '#8c8c8c', fontSize: 12 }} /><Text style={{ fontSize: 13 }}>{record.primaryPhone}</Text></Space>
          )}
        </Space>
      ),
    },
    {
      title: t('field.city'), dataIndex: 'primaryCity', key: 'primaryCity', width: 120, ellipsis: true,
      render: (city: string) => city
        ? <Space size={4}><EnvironmentOutlined style={{ color: '#8c8c8c', fontSize: 12 }} /><Text>{city}</Text></Space>
        : <Text type="secondary">-</Text>,
    },
    {
      title: t('field.isActive'), dataIndex: 'isActive', key: 'isActive', width: 80, align: 'center',
      filters: [{ text: tc('status.active'), value: true }, { text: tc('status.inactive'), value: false }],
      render: (isActive: boolean) => <Badge status={isActive ? 'success' : 'default'} text={isActive ? tc('confirm.yes') : tc('confirm.no')} />,
    },
  ];

  const handleTableChange: TableProps<ContactListItem>['onChange'] = (_pagination, tableFilters) => {
    setFilters({
      ...filters,
      isActive: tableFilters.isActive?.length ? (tableFilters.isActive[0] as boolean) : undefined,
    });
  };

  const hasActiveFilters = !!(filters.contactName || filters.accountId || filters.title || filters.department);

  return (
    <ListPageLayout<ContactListItem>
      title={t('list.title')}
      subtitle={t('list.subtitle')}
      createButtonLabel={t('action.create')}
      onCreate={() => navigate(RoutePaths.Contact.New)}

      searchPlaceholder={t('placeholder.search')}
      searchValue={filters.contactName ?? ''}
      onSearch={handleSearch}
      hasActiveFilters={hasActiveFilters}
      onResetFilters={resetFilters}
      onRefresh={fetchContacts}
      renderExtraFilters={() => (
        <>
          <Input
            placeholder={t('field.title')} allowClear style={{ width: 150 }}
            value={filters.title || ''}
            onChange={(e) => handleFilterChange('title', e.target.value)}
          />
          <Input
            placeholder={t('field.department')} allowClear style={{ width: 150 }}
            value={filters.department || ''}
            onChange={(e) => handleFilterChange('department', e.target.value)}
          />
        </>
      )}

      selectedRowKeys={selectedRowKeys}
      onSelectionChange={setSelectedRowKeys}
      onClearSelection={clearSelectedRowKeys}

      onBulkDelete={{
        handler: bulkDeleteContacts,
        confirm: {
          title: tc('confirm.bulkDeleteTitle'),
          content: (count) => t('confirm.bulkDeleteContent', { count }),
        },
      }}
      onBulkActivate={{
        handler: bulkActivateContacts,
        confirm: {
          title: tc('confirm.bulkActivateTitle'),
          content: (count) => t('confirm.bulkActivateContent', { count }),
        },
      }}
      onBulkDeactivate={{
        handler: bulkDeactivateContacts,
        confirm: {
          title: tc('confirm.bulkDeactivateTitle'),
          content: (count) => t('confirm.bulkDeactivateContent', { count }),
        },
      }}
      onBulkAssign={{ handler: bulkAssignContacts }}

      rowActions={{
        onView: (record) => navigate(RoutePaths.Contact.View(record.id)),
        onEdit: (record) => navigate(RoutePaths.Contact.Edit(record.id)),
        isActiveResolver: (record) => record.isActive,
        onActivate: {
          handler: (record) => activateContact(record.id),
        },
        onDeactivate: {
          handler: (record) => deactivateContact(record.id),
        },
        onAssign: {
          handler: (record, entity) => assignContact(record.id, entity),
        },
        onDelete: {
          handler: (record) => deleteContact(record.id),
          confirm: {
            title: t('confirm.deleteTitle'),
            content: (record) => t('confirm.rowDeleteContent', { name: record.fullName }),
          },
        },
      }}

      dataSource={contacts}
      columns={columns}
      loading={false}
      tableScrollX={1100}
      onTableChange={handleTableChange}
      onRowClick={handleRowClick}

      page={page}
      pageSize={pageSize}
      hasMore={hasMore}
      totalItems={contacts?.length ?? 0}
      onPageChange={(p) => setPagination({ page: p })}
      onPageSizeChange={(ps) => setPagination({ pageSize: ps })}
    />
  );
};

export default ContactList;