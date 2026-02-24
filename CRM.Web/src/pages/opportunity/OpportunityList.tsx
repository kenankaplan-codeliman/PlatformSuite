import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/config/route.paths';
import {
  Card,
  Button,
  Space,
  Input,
  Row,
  Col,
  Dropdown,
  Modal,
  Tooltip,
  Typography,
  Flex,
  Tag,
  Badge,
  Select,
  Divider,
} from 'antd';
import type { MenuProps } from 'antd';
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
  RiseOutlined,
  BankOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import type { OpportunityListItem } from '@/types/opportunity.types';
import {
  KANBAN_STAGE_ORDER,
  OpportunityStage,
  getOpportunityStageLabel,
  getOpportunityStageColor,
  formatCurrency,
  opportunityStageOptions,
  opportunitySourceOptions,
} from '@/types/opportunity.types';
import { useOpportunityStore } from '@/stores/opportunity.store';
import opportunityService from '@/services/opportunity.service';
import { handleError } from '@/hooks/useHandleError';
import { StateType, useProcessState } from '@/stores/process.state.store';

const { Title, Text } = Typography;
const { Search } = Input;

// ─── Kanban Card ──────────────────────────────────────────────────────────────

interface KanbanCardProps {
  record: OpportunityListItem;
  onView: (record: OpportunityListItem) => void;
  onEdit: (record: OpportunityListItem) => void;
  onDelete: (record: OpportunityListItem) => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ record, onView, onEdit, onDelete }) => {
  const actionItems: MenuProps['items'] = [
    {
      key: 'view',
      label: 'Görüntüle',
      icon: <RiseOutlined />,
      onClick: (info) => { info.domEvent.stopPropagation(); onView(record); },
    },
    {
      key: 'edit',
      label: 'Düzenle',
      icon: <EditOutlined />,
      onClick: (info) => { info.domEvent.stopPropagation(); onEdit(record); },
    },
    { type: 'divider' },
    {
      key: 'delete',
      label: 'Sil',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: (info) => { info.domEvent.stopPropagation(); onDelete(record); },
    },
  ];

  return (
    <Card
      size="small"
      hoverable
      onClick={() => onView(record)}
      style={{ marginBottom: 8, cursor: 'pointer', borderRadius: 8 }}
      styles={{ body: { padding: '10px 12px' } }}
    >
      <Flex justify="space-between" align="flex-start">
        <Text
          strong
          style={{ fontSize: 13, flex: 1, marginRight: 4, color: '#1f1f1f' }}
          ellipsis={{ tooltip: record.name }}
        >
          {record.name}
        </Text>
        <Dropdown menu={{ items: actionItems }} trigger={['click']}>
          <Button
            type="text"
            size="small"
            icon={<MoreOutlined />}
            style={{ flexShrink: 0 }}
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      </Flex>

      <div style={{ marginTop: 6 }}>
        <Text strong style={{ fontSize: 14, color: '#52c41a' }}>
          {formatCurrency(record.estimatedValue, record.currency)}
        </Text>
      </div>

      {record.accountName && (
        <Flex align="center" gap={4} style={{ marginTop: 6 }}>
          <BankOutlined style={{ fontSize: 11, color: '#8c8c8c' }} />
          <Text type="secondary" style={{ fontSize: 12 }} ellipsis>
            {record.accountName}
          </Text>
        </Flex>
      )}

      {record.contactName && (
        <Flex align="center" gap={4} style={{ marginTop: 4 }}>
          <UserOutlined style={{ fontSize: 11, color: '#8c8c8c' }} />
          <Text type="secondary" style={{ fontSize: 12 }} ellipsis>
            {record.contactName}
          </Text>
        </Flex>
      )}

      <Flex justify="space-between" align="center" style={{ marginTop: 8 }}>
        <Tag color="blue" style={{ fontSize: 11, margin: 0 }}>
          %{record.probability}
        </Tag>
        {record.closeDate && (
          <Flex align="center" gap={4}>
            <CalendarOutlined style={{ fontSize: 11, color: '#8c8c8c' }} />
            <Text type="secondary" style={{ fontSize: 11 }}>
              {new Date(record.closeDate).toLocaleDateString('tr-TR')}
            </Text>
          </Flex>
        )}
        <Badge
          status={record.isActive ? 'success' : 'default'}
          text={
            <Text type="secondary" style={{ fontSize: 11 }}>
              {record.isActive ? 'Aktif' : 'Pasif'}
            </Text>
          }
        />
      </Flex>
    </Card>
  );
};

// ─── Kanban Column ────────────────────────────────────────────────────────────

interface KanbanColumnProps {
  stage: (typeof OpportunityStage)[keyof typeof OpportunityStage];
  items: OpportunityListItem[];
  onView: (record: OpportunityListItem) => void;
  onEdit: (record: OpportunityListItem) => void;
  onDelete: (record: OpportunityListItem) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ stage, items, onView, onEdit, onDelete }) => {
  const color = getOpportunityStageColor(stage);
  const label = getOpportunityStageLabel(stage);
  const totalValue = items.reduce((sum, i) => sum + i.estimatedValue, 0);

  return (
    <div
      style={{
        width: 260,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Kolon Başlığı */}
      <div
        style={{
          background: color,
          borderRadius: '8px 8px 0 0',
          padding: '8px 12px',
        }}
      >
        <Flex justify="space-between" align="center">
          <Text strong style={{ color: '#fff', fontSize: 13 }}>
            {label}
          </Text>
          <Tag
            style={{
              background: 'rgba(255,255,255,0.25)',
              border: 'none',
              color: '#fff',
              fontSize: 11,
              margin: 0,
            }}
          >
            {items.length}
          </Tag>
        </Flex>
        {items.length > 0 && (
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11 }}>
            {formatCurrency(totalValue)}
          </Text>
        )}
      </div>

      {/* Kart Listesi */}
      <div
        style={{
          background: '#f5f5f5',
          borderRadius: '0 0 8px 8px',
          padding: '8px',
          flex: 1,
          minHeight: 120,
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 300px)',
        }}
      >
        {items.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '24px 0',
              color: '#bfbfbf',
              fontSize: 12,
            }}
          >
            Kayıt yok
          </div>
        ) : (
          items.map((item) => (
            <KanbanCard
              key={item.id}
              record={item}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const OpportunityList: React.FC = () => {
  const navigate = useNavigate();
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const {
    opportunities,
    filters,
    fetchOpportunities,
    setFilters,
    resetFilters,
    deleteOpportunity,
  } = useOpportunityStore();

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchOpportunities();
    }
  }, [fetchOpportunities]);

  // Stage'e göre gruplama
  const groupedByStage = KANBAN_STAGE_ORDER.reduce<
    Record<string, OpportunityListItem[]>
  >((acc, stage) => {
    acc[stage] = opportunities.filter((o) => o.stage === stage);
    return acc;
  }, {} as Record<string, OpportunityListItem[]>);

  const handleView = useCallback(
    (record: OpportunityListItem) => navigate(RoutePaths.Opportunity.View(record.id)),
    [navigate]
  );

  const handleEdit = useCallback(
    (record: OpportunityListItem) => navigate(RoutePaths.Opportunity.Edit(record.id)),
    [navigate]
  );

  const handleCreate = useCallback(
    () => navigate(RoutePaths.Opportunity.New),
    [navigate]
  );

  const handleDelete = useCallback(
    (record: OpportunityListItem) => {
      Modal.confirm({
        title: 'Fırsat Silme',
        content: `"${record.name}" fırsatı silinecek. Onaylıyor musunuz?`,
        okText: 'Sil',
        okType: 'danger',
        cancelText: 'İptal',
        onOk: async () => {
          try {
            await deleteOpportunity(record.id);
          } catch (error) {
            const errorMessage = handleError(error);
            const { setState } = useProcessState.getState();
            setState(StateType.Error, 'Silme Başarısız', errorMessage);
          }
        },
      });
    },
    [deleteOpportunity]
  );

  const handleSearch = useCallback(
    (value: string) => {
      setSearchText(value);
      setFilters({ ...filters, name: value || undefined });
    },
    [filters, setFilters]
  );

  const handleFilterChange = useCallback(
    (field: string, value: unknown) => {
      setFilters({
        ...filters,
        [field]: value === '' || value === null || value === undefined ? undefined : value,
      });
    },
    [filters, setFilters]
  );

  const handleExport = useCallback(async () => {
    const { setState } = useProcessState.getState();
    try {
      setState(StateType.Loading, 'Dışa Aktarılıyor', 'Fırsat listesi hazırlanıyor...');
      const blob = await opportunityService.exportOpportunities(filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `opportunities_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      setState(StateType.Success, 'Dışa Aktarıldı', 'Fırsat listesi dışa aktarıldı');
    } catch (error) {
      const errorMessage = handleError(error);
      setState(StateType.Error, 'Dışa aktarılamadı', errorMessage);
    }
  }, [filters]);

  const hasActiveFilters =
    !!filters.name || !!filters.stage || !!filters.accountId || !!filters.source;

  // Özet istatistikler
  const totalValue = opportunities.reduce((s, o) => s + o.estimatedValue, 0);
  const wonValue = opportunities
    .filter((o) => o.stage === OpportunityStage.Won)
    .reduce((s, o) => s + (o.actualValue ?? o.estimatedValue), 0);

  return (
    <div style={{ padding: 24 }}>
      {/* Page Header */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Fırsat Yönetimi
          </Title>
          <Text type="secondary">Satış fırsatlarını kanban görünümüyle yönetin</Text>
        </div>
        <Space>
          <Button icon={<ExportOutlined />} onClick={handleExport}>
            Dışa Aktar
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Yeni Fırsat
          </Button>
        </Space>
      </Flex>

      {/* Özet Kartları */}
      <Row gutter={12} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card size="small" styles={{ body: { padding: '12px 16px' } }}>
            <Flex align="center" gap={8}>
              <RiseOutlined style={{ color: '#1890ff', fontSize: 20 }} />
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>Toplam Fırsat</Text>
                <div>
                  <Text strong style={{ fontSize: 16 }}>{opportunities.length}</Text>
                </div>
              </div>
            </Flex>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" styles={{ body: { padding: '12px 16px' } }}>
            <Flex align="center" gap={8}>
              <DollarOutlined style={{ color: '#52c41a', fontSize: 20 }} />
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>Toplam Değer</Text>
                <div>
                  <Text strong style={{ fontSize: 14, color: '#52c41a' }}>
                    {formatCurrency(totalValue)}
                  </Text>
                </div>
              </div>
            </Flex>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" styles={{ body: { padding: '12px 16px' } }}>
            <Flex align="center" gap={8}>
              <DollarOutlined style={{ color: '#faad14', fontSize: 20 }} />
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>Kazanılan</Text>
                <div>
                  <Text strong style={{ fontSize: 14, color: '#faad14' }}>
                    {formatCurrency(wonValue)}
                  </Text>
                </div>
              </div>
            </Flex>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" styles={{ body: { padding: '12px 16px' } }}>
            <Flex align="center" gap={8}>
              <RiseOutlined style={{ color: '#722ed1', fontSize: 20 }} />
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>Aktif Fırsat</Text>
                <div>
                  <Text strong style={{ fontSize: 16 }}>
                    {opportunities.filter((o) => o.isActive &&
                      o.stage !== OpportunityStage.Won &&
                      o.stage !== OpportunityStage.Lost
                    ).length}
                  </Text>
                </div>
              </div>
            </Flex>
          </Card>
        </Col>
      </Row>

      {/* Filtre Kartı */}
      <Card style={{ marginBottom: 16 }} styles={{ body: { padding: '12px 24px' } }}>
        <Row gutter={[16, 12]} align="middle">
          <Col flex="auto">
            <Space size="middle" wrap>
              <Search
                placeholder="Fırsat adı ara..."
                allowClear
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={handleSearch}
                style={{ width: 260 }}
                prefix={<SearchOutlined />}
              />

              {filterVisible && (
                <>
                  <Select
                    placeholder="Aşama"
                    allowClear
                    style={{ width: 160 }}
                    options={opportunityStageOptions}
                    value={filters.stage}
                    onChange={(val) => handleFilterChange('stage', val)}
                  />
                  <Select
                    placeholder="Kaynak"
                    allowClear
                    style={{ width: 180 }}
                    options={opportunitySourceOptions}
                    value={filters.source}
                    onChange={(val) => handleFilterChange('source', val)}
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
                    onClick={() => { resetFilters(); setSearchText(''); }}
                  />
                </Tooltip>
              )}
              <Tooltip title="Yenile">
                <Button icon={<ReloadOutlined />} onClick={() => fetchOpportunities()} />
              </Tooltip>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Kanban Board */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          overflowX: 'auto',
          paddingBottom: 16,
        }}
      >
        {KANBAN_STAGE_ORDER.map((stage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            items={groupedByStage[stage] ?? []}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default OpportunityList;