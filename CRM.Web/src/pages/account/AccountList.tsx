import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RoutePaths } from '@/config/route.paths';
import { Badge, Input, Select, Space, Tag, Tooltip, Typography } from 'antd';
import type { TableProps } from 'antd';
import type { ColumnsType } from 'antd/es/table/interface';
import { EnvironmentOutlined, GlobalOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import type { AccountListItem, AccountTypeValue } from '@/types/account.types';
import {
  accountTypeFilters,
  accountTypeOptions,
  getAccountTypeColor,
  getAccountTypeLabel,
} from '@/types/account.types';
import { useAccountStore } from '@/stores/account.store';
import ListPageLayout from '@/components/ListPageLayout';

const { Text } = Typography;

const AccountList: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('account');
  const { t: tc } = useTranslation('common');

  const {
    accounts, hasMore, page, pageSize, filters, selectedRowKeys,
    fetchAccounts, setPagination, setFilters, resetFilters,
    setSelectedRowKeys, clearSelectedRowKeys,
    bulkDeleteAccounts, bulkActivateAccounts, bulkDeactivateAccounts, bulkAssignAccounts,
    activateAccount, deactivateAccount, assignAccount, deleteAccount,
  } = useAccountStore();

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; fetchAccounts(); }
  }, [fetchAccounts]);

  const handleRowClick = useCallback(
    (record: AccountListItem) => navigate(RoutePaths.Account.View(record.id)),
    [navigate]
  );

  const handleSearch = useCallback(
    (value: string) => setFilters({ ...filters, accountName: value || undefined }),
    [filters, setFilters]
  );

  const handleFilterChange = useCallback(
    (field: string, value: unknown) =>
      setFilters({ ...filters, [field]: value === '' || value === null ? undefined : value }),
    [filters, setFilters]
  );

  const normalizeUrl = (url?: string) => {
    if (!url) return '';
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  };

  const columns: ColumnsType<AccountListItem> = [
    {
      title: t('field.name'), dataIndex: 'accountName', key: 'accountName', sorter: true, width: 220,
      render: (text: string) => <Text strong style={{ cursor: 'pointer', color: '#1890ff' }}>{text}</Text>,
    },
    {
      title: t('field.accountType'), dataIndex: 'accountType', key: 'accountType', width: 120,
      filters: accountTypeFilters,
      render: (type: AccountTypeValue) => (
        <Tag color={getAccountTypeColor(type)}>{getAccountTypeLabel(type)}</Tag>
      ),
    },
    {
      title: t('section.contactInfo', 'İletişim'), key: 'contact', width: 220,
      render: (_: unknown, record: AccountListItem) => (
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
    { title: t('field.industry'), dataIndex: 'industry', key: 'industry', width: 140, ellipsis: true },
    {
      title: t('field.city'), dataIndex: 'primaryCity', key: 'primaryCity', width: 120, ellipsis: true,
      render: (city: string) => city
        ? <Space size={4}><EnvironmentOutlined style={{ color: '#8c8c8c', fontSize: 12 }} /><Text>{city}</Text></Space>
        : '-',
    },
    {
      title: t('field.employees'), dataIndex: 'numberOfEmployees', key: 'numberOfEmployees', width: 100, align: 'right', sorter: true,
      render: (value: number) => value ? value.toLocaleString('tr-TR') : '-',
    },
    {
      title: t('field.annualRevenue'), dataIndex: 'annualRevenue', key: 'annualRevenue', width: 140, align: 'right', sorter: true,
      render: (value: number) => value ? `₺${value.toLocaleString('tr-TR')}` : '-',
    },
    {
      title: t('field.web'), dataIndex: 'website', key: 'website', width: 60, align: 'center',
      render: (url: string) => url
        ? <Tooltip title={url}><a href={normalizeUrl(url)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}><GlobalOutlined style={{ color: '#1890ff' }} /></a></Tooltip>
        : '-',
    },
    {
      title: t('field.isActive'), dataIndex: 'isActive', key: 'isActive', width: 80, align: 'center',
      filters: [{ text: tc('status.active'), value: true }, { text: tc('status.inactive'), value: false }],
      render: (isActive: boolean) => (
        <Badge status={isActive ? 'success' : 'default'} text={isActive ? tc('confirm.yes') : tc('confirm.no')} />
      ),
    },
  ];

  const handleTableChange: TableProps<AccountListItem>['onChange'] = (_pagination, tableFilters) => {
    setFilters({
      ...filters,
      accountType: tableFilters.accountType ? (tableFilters.accountType[0] as AccountTypeValue) : undefined,
      isActive: tableFilters.isActive?.length ? (tableFilters.isActive[0] as boolean) : undefined,
    });
  };

  const hasActiveFilters = !!(filters.accountName || filters.accountType !== undefined || filters.industry);

  return (
    <ListPageLayout<AccountListItem>
      title={t('list.title')}
      subtitle={t('list.subtitle')}
      createButtonLabel={t('action.create')}
      onCreate={() => navigate(RoutePaths.Account.New)}

      searchPlaceholder={t('placeholder.search')}
      searchValue={filters.accountName ?? ''}
      onSearch={handleSearch}
      hasActiveFilters={hasActiveFilters}
      onResetFilters={resetFilters}
      onRefresh={fetchAccounts}
      renderExtraFilters={() => (
        <>
          <Select
            placeholder={t('field.accountType')} allowClear style={{ width: 160 }}
            value={filters.accountType}
            onChange={(value) => handleFilterChange('accountType', value)}
            options={accountTypeOptions}
          />
          <Input
            placeholder={t('field.industry')} allowClear style={{ width: 150 }}
            value={filters.industry || ''}
            onChange={(e) => handleFilterChange('industry', e.target.value)}
          />
        </>
      )}

      selectedRowKeys={selectedRowKeys}
      onSelectionChange={setSelectedRowKeys}
      onClearSelection={clearSelectedRowKeys}

      onBulkDelete={{
        handler: bulkDeleteAccounts,
        confirm: {
          title: tc('confirm.bulkDeleteTitle'),
          content: (count) => t('confirm.bulkDeleteContent', { count }),
        },
      }}
      onBulkActivate={{
        handler: bulkActivateAccounts,
        confirm: {
          title: tc('confirm.bulkActivateTitle'),
          content: (count) => t('confirm.bulkActivateContent', { count }),
        },
      }}
      onBulkDeactivate={{
        handler: bulkDeactivateAccounts,
        confirm: {
          title: tc('confirm.bulkDeactivateTitle'),
          content: (count) => t('confirm.bulkDeactivateContent', { count }),
        },
      }}
      onBulkAssign={{ handler: bulkAssignAccounts }}

      rowActions={{
        onView: (record) => navigate(RoutePaths.Account.View(record.id)),
        onEdit: (record) => navigate(RoutePaths.Account.Edit(record.id)),
        isActiveResolver: (record) => record.isActive,
        onActivate: { handler: (record) => activateAccount(record.id) },
        onDeactivate: { handler: (record) => deactivateAccount(record.id) },
        onAssign: { handler: (record, entity) => assignAccount(record.id, entity) },
        onDelete: {
          handler: (record) => deleteAccount(record.id),
          confirm: {
            title: t('confirm.deleteTitle'),
            content: (record) => t('confirm.rowDeleteContent', { name: record.accountName }),
          },
        },
      }}

      dataSource={accounts}
      columns={columns}
      loading={false}
      tableScrollX={1400}
      onTableChange={handleTableChange}
      onRowClick={handleRowClick}

      page={page}
      pageSize={pageSize}
      hasMore={hasMore}
      totalItems={accounts?.length ?? 0}
      onPageChange={(p) => setPagination({ page: p })}
      onPageSizeChange={(ps) => setPagination({ pageSize: ps })}
    />
  );
};

export default AccountList;
