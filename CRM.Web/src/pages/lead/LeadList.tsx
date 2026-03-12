import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/config/route.paths';
import { Badge, Input, Select, Space, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import {
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table/interface';
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
import ListPageLayout from '@/components/ListPageLayout';
import { CheckCircleOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Text } = Typography;

const LeadList: React.FC = () => {
  const navigate = useNavigate();

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
    deleteLead,
    bulkDeleteLeads,
    bulkActivateLeads,
    bulkDeactivateLeads,
    bulkUpdateStatus,
    bulkAssignLeads,
    activateLead,
    deactivateLead,
    assignLead,
  } = useLeadStore();

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchLeads();
    }
  }, [fetchLeads]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleSearch = useCallback(
    (value: string) => setFilters({ ...filters, companyName: value || undefined }),
    [filters, setFilters]
  );

  const handleFilterChange = useCallback(
    (field: string, value: unknown) =>
      setFilters({
        ...filters,
        [field]: value === '' || value === null || value === undefined ? undefined : value,
      }),
    [filters, setFilters]
  );

  // Table onChange — kolon filtreleri
  const handleTableChange: TableProps<LeadListItem>['onChange'] = (_pagination, tableFilters) => {
    setFilters({
      ...filters,
      leadStatus: tableFilters.leadStatus?.[0] as LeadStatusValue ?? undefined,
      leadRating: tableFilters.leadRating?.[0] as LeadRatingValue ?? undefined,
      isActive: (tableFilters.isActive?.length ?? 0) > 0
        ? tableFilters.isActive![0] as boolean
        : undefined,
    });
  };

  // ── hasActiveFilters ────────────────────────────────────────────────────────
  const hasActiveFilters = !!(
    filters.companyName ||
    filters.leadStatus !== undefined ||
    filters.leadRating !== undefined ||
    filters.leadSource !== undefined ||
    filters.industry
  );

  // ── Bulk: durum değiştir — extraBulkItems ────────────────────────────────────
  const extraBulkItems = useCallback((): MenuProps['items'] => [
    {
      key: 'status',
      label: 'Durum Değiştir',
      icon: <CheckCircleOutlined />,
      children: [
        {
          key: `status-${LeadStatus.New}`,
          label: getLeadStatusLabel(LeadStatus.New),
          onClick: () => bulkUpdateStatus(LeadStatus.New),
        },
        {
          key: `status-${LeadStatus.Contacted}`,
          label: getLeadStatusLabel(LeadStatus.Contacted),
          onClick: () => bulkUpdateStatus(LeadStatus.Contacted),
        },
        {
          key: `status-${LeadStatus.Qualified}`,
          label: getLeadStatusLabel(LeadStatus.Qualified),
          onClick: () => bulkUpdateStatus(LeadStatus.Qualified),
        },
        {
          key: `status-${LeadStatus.Unqualified}`,
          label: getLeadStatusLabel(LeadStatus.Unqualified),
          onClick: () => bulkUpdateStatus(LeadStatus.Unqualified),
        },
      ],
    },
  ], [bulkUpdateStatus]);

  // ── Columns ─────────────────────────────────────────────────────────────────
  const columns: ColumnsType<LeadListItem> = [
    {
      title: 'Şirket Adı',
      dataIndex: 'companyName',
      key: 'companyName',
      sorter: true,
      width: 200,
      render: (text: string, record: LeadListItem) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ cursor: 'pointer', color: '#1890ff' }}>{text}</Text>
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
        <Space direction="vertical" size={2}>
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
      render: (value: number) => (value ? `₺${value.toLocaleString('tr-TR')}` : '-'),
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
  ];

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <ListPageLayout<LeadListItem>
      title="Lead Yönetimi"
      subtitle="Potansiyel müşterilerinizi yönetin"
      createButtonLabel="Yeni Lead"
      onCreate={() => navigate(RoutePaths.Lead.New)}

      searchPlaceholder="Şirket adı ara..."
      searchValue={filters.companyName ?? ''}
      onSearch={handleSearch}
      hasActiveFilters={hasActiveFilters}
      onResetFilters={resetFilters}
      onRefresh={fetchLeads}
      renderExtraFilters={() => (
        <>
          <Select
            placeholder="Durum" allowClear style={{ width: 160 }}
            value={filters.leadStatus}
            onChange={(val) => handleFilterChange('leadStatus', val)}
            options={leadStatusOptions}
          />
          <Select
            placeholder="Değerlendirme" allowClear style={{ width: 140 }}
            value={filters.leadRating}
            onChange={(val) => handleFilterChange('leadRating', val)}
            options={leadRatingOptions}
          />
          <Select
            placeholder="Kaynak" allowClear style={{ width: 150 }}
            value={filters.leadSource}
            onChange={(val) => handleFilterChange('leadSource', val)}
            options={leadSourceOptions}
          />
          <Input
            placeholder="Sektör" allowClear style={{ width: 150 }}
            value={filters.industry || ''}
            onChange={(e) => handleFilterChange('industry', e.target.value)}
          />
        </>
      )}

      selectedRowKeys={selectedRowKeys}
      onSelectionChange={setSelectedRowKeys}
      onClearSelection={clearSelectedRowKeys}

      onBulkDelete={{
        handler: bulkDeleteLeads,
        confirm: {
          title: 'Toplu Silme',
          content: (count) => `Seçili ${count} lead silinecek. Onaylıyor musunuz?`,
        },
      }}
      onBulkActivate={{ handler: bulkActivateLeads }}
      onBulkDeactivate={{ handler: bulkDeactivateLeads }}
      onBulkAssign={{ handler: bulkAssignLeads }}
      extraBulkItems={extraBulkItems}

      rowActions={{
        onView: (record) => navigate(RoutePaths.Lead.View(record.id)),
        onEdit: (record) => navigate(RoutePaths.Lead.Edit(record.id)),
        isActiveResolver: (record) => record.isActive,
        onActivate: { handler: (record) => activateLead(record.id) },
        onDeactivate: { handler: (record) => deactivateLead(record.id) },
        onAssign: { handler: (record, entity) => assignLead(record.id, entity) },
        onDelete: {
          handler: (record) => deleteLead(record.id),
          confirm: {
            title: 'Lead Silme',
            content: (record) => `"${record.companyName}" lead'i silinecek. Onaylıyor musunuz?`,
          },
        },
      }}

      dataSource={leads}
      columns={columns}
      rowKey="id"
      tableScrollX={1300}
      onTableChange={handleTableChange}
      onRowClick={(record) => navigate(RoutePaths.Lead.View(record.id))}

      page={page}
      pageSize={pageSize}
      hasMore={hasMore}
      totalItems={leads?.length ?? 0}
      pageSizeOptions={[10, 20, 50, 100]}
      onPageChange={(p) => setPagination({ page: p })}
      onPageSizeChange={(ps) => setPagination({ pageSize: ps })}
    />
  );
};

export default LeadList;