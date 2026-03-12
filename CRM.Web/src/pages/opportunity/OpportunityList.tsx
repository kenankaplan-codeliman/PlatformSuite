import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/config/route.paths';
import { Badge, Button, Card, Dropdown, Flex, Select, Tag, Typography } from 'antd';
import type { MenuProps } from 'antd';
import {
  BankOutlined,
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  RiseOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { OpportunityListItem } from '@/types/opportunity.types';
import {
  formatCurrency,
  getOpportunityStageColor,
  getOpportunityStageLabel,
  KANBAN_STAGE_ORDER,
  opportunitySourceOptions,
  opportunityStageOptions,
  OpportunityStage,
} from '@/types/opportunity.types';
import { useOpportunityStore } from '@/stores/opportunity.store';
import ListPageLayout from '@/components/ListPageLayout';

const { Text } = Typography;

// ─── Height constants ─────────────────────────────────────────────────────────
// ListPageLayout içindeki sabit alanlar:
//   padding-top: 24px
//   page header (title + subtitle + margin-bottom): ~94px
//   filter card (height + margin): ~80px
//   padding-bottom: 24px
// Toplam gidilen: ~222px → 240px olarak yuvarlıyoruz
//const BOARD_HEIGHT = 'calc(100vh - 240px)';

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
      key: 'view', label: 'Görüntüle', icon: <RiseOutlined />,
      onClick: (info) => { info.domEvent.stopPropagation(); onView(record); },
    },
    {
      key: 'edit', label: 'Düzenle', icon: <EditOutlined />,
      onClick: (info) => { info.domEvent.stopPropagation(); onEdit(record); },
    },
    { type: 'divider' },
    {
      key: 'delete', label: 'Sil', icon: <DeleteOutlined />, danger: true,
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
    // Kolon: tam yüksekliği kapla, dikey flex
    <div
      style={{
        width: 260,
        minWidth: 260,  // yatay scroll'da ezilmesin
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%', // board container'ın yüksekliğini doldur
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      }}
    >
      {/* Sabit başlık */}
      <div
        style={{
          background: color,
          padding: '10px 12px',
          flexShrink: 0, // başlık sıkışmasın
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
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, marginTop: 2, display: 'block' }}>
            {formatCurrency(totalValue)}
          </Text>
        )}
      </div>

      {/* Scrollable kart alanı — flex: 1 + minHeight: 0 kritik */}
      <div
        style={{
          background: '#f5f5f5',
          padding: '8px',
          flex: 1,
          minHeight: 0,   // flex child'ın scroll yapabilmesi için şart
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {items.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '32px 0',
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

// ─── Kanban Board ─────────────────────────────────────────────────────────────

interface KanbanBoardProps {
  groupedByStage: Record<string, OpportunityListItem[]>;
  onView: (record: OpportunityListItem) => void;
  onEdit: (record: OpportunityListItem) => void;
  onDelete: (record: OpportunityListItem) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ groupedByStage, onView, onEdit, onDelete }) => (
  // Board: sabit yükseklik, yatay scroll, kolonlar bu yüksekliği doldurur
<div
  style={{
    display: "flex",
    gap: 12,
    height: "100%",
    overflowX: "auto",
    overflowY: "hidden",
    paddingBottom: 8,
    paddingLeft: 2,
    alignItems: "stretch",
  }}
>
    {KANBAN_STAGE_ORDER.map((stage) => (
      <KanbanColumn
        key={stage}
        stage={stage}
        items={groupedByStage[stage] ?? []}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const OpportunityList: React.FC = () => {
  const navigate = useNavigate();

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

  const groupedByStage = KANBAN_STAGE_ORDER.reduce<Record<string, OpportunityListItem[]>>(
    (acc, stage) => {
      acc[stage] = opportunities.filter((o) => o.stage === stage);
      return acc;
    },
    {} as Record<string, OpportunityListItem[]>
  );

  const handleView = useCallback(
    (record: OpportunityListItem) => navigate(RoutePaths.Opportunity.View(record.id)),
    [navigate]
  );
  const handleEdit = useCallback(
    (record: OpportunityListItem) => navigate(RoutePaths.Opportunity.Edit(record.id)),
    [navigate]
  );
  const handleDelete = useCallback(
    (record: OpportunityListItem) => deleteOpportunity(record.id),
    [deleteOpportunity]
  );

  const handleSearch = useCallback(
    (value: string) => setFilters({ ...filters, name: value || undefined }),
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

  const hasActiveFilters = !!(filters.name || filters.stage || filters.accountId || filters.source);

  return (
    <ListPageLayout<OpportunityListItem>
      title="Fırsat Yönetimi"
      subtitle="Satış fırsatlarını kanban görünümüyle yönetin"
      createButtonLabel="Yeni Fırsat"
      onCreate={() => navigate(RoutePaths.Opportunity.New)}

      searchPlaceholder="Fırsat adı ara..."
      searchValue={filters.name ?? ''}
      onSearch={handleSearch}
      hasActiveFilters={hasActiveFilters}
      onResetFilters={resetFilters}
      onRefresh={fetchOpportunities}
      renderExtraFilters={() => (
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

      selectedRowKeys={[]}
      onSelectionChange={() => {}}
      onClearSelection={() => {}}

      renderContent={() => (
        <KanbanBoard
          groupedByStage={groupedByStage}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    />
  );
};

export default OpportunityList;