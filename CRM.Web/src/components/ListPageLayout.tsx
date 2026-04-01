import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Button,
  Space,
  Input,
  Row,
  Col,
  Dropdown,
  Table,
  Tooltip,
  Typography,
  Flex,
  Modal,
} from 'antd';
import type { TableProps, MenuProps } from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface';
import {
  PlusOutlined,
  DeleteOutlined,
  FilterOutlined,
  ReloadOutlined,
  MoreOutlined,
  SearchOutlined,
  ClearOutlined,
  CheckCircleOutlined,
  StopOutlined,
  UserAddOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import EntityLookup from '@/components/EntityLookup';
import { EntityType, type EntityReference } from '@/types/entity.lookup.types';
import { entitySearchService } from '@/services/entity.search.service';
import CustomPagination from '@/components/CustomPagination';

const { Title, Text } = Typography;
const { Search } = Input;

// ─── Confirm Config Types ─────────────────────────────────────────────────────

export interface BulkConfirm {
  title?: string;
  content?: (count: number) => string;
}

export interface RowConfirm<T> {
  title?: string | ((record: T) => string);
  content?: string | ((record: T) => string);
}

// ─── Action Types ─────────────────────────────────────────────────────────────

export interface BulkAction {
  handler: () => void | Promise<void>;
  confirm?: BulkConfirm;
}

export interface BulkAssignAction {
  handler: (entity: EntityReference | EntityReference[] | null) => void | Promise<void>;
  confirm?: BulkConfirm;
}

export interface RowDeleteAction<T> {
  handler: (record: T) => void | Promise<void>;
  confirm?: RowConfirm<T>;
}

export interface RowAction<T> {
  handler: (record: T) => void | Promise<void>;
  confirm?: RowConfirm<T>;
}

export interface RowAssignAction<T> {
  handler: (record: T, entity: EntityReference | EntityReference[] | null) => void | Promise<void>;
}

// ─── Row Action Config ────────────────────────────────────────────────────────

export interface RowActionConfig<T> {
  onView?: (record: T) => void;
  onEdit?: (record: T) => void;
  /**
   * Kaydın aktif/pasif durumunu döndüren resolver.
   * Tanımlandığında:
   *   - true  → sadece "Pasifleştir" gösterilir
   *   - false → sadece "Etkinleştir" gösterilir
   * Tanımlanmadığında onActivate ve onDeactivate bağımsız olarak her zaman gösterilir.
   */
  isActiveResolver?: (record: T) => boolean;
  onActivate?: RowAction<T>;
  onDeactivate?: RowAction<T>;
  onAssign?: RowAssignAction<T>;
  onDelete?: RowDeleteAction<T>;
  extraItems?: (record: T) => MenuProps['items'];
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ListPageLayoutProps<T extends object> {
  // ── Header ──────────────────────────────────────────────────────────────
  title: string;
  subtitle?: string;
  createButtonLabel?: string;
  onCreate?: () => void;
  renderExtraHeaderActions?: () => React.ReactNode;

  // ── Filters ─────────────────────────────────────────────────────────────
  searchPlaceholder?: string;
  searchValue?: string;
  onSearch?: (value: string) => void;
  onSearchChange?: (value: string) => void;
  hasActiveFilters?: boolean;
  onResetFilters?: () => void;
  onRefresh?: () => void;
  renderExtraFilters?: () => React.ReactNode;

  // ── Selection (tablo modunda kullanılır) ─────────────────────────────────
  selectedRowKeys?: React.Key[];
  onSelectionChange?: (keys: string[]) => void;
  onClearSelection?: () => void;

  // ── Bulk Actions ─────────────────────────────────────────────────────────
  onBulkDelete?: BulkAction;
  onBulkActivate?: BulkAction;
  onBulkDeactivate?: BulkAction;
  onBulkAssign?: BulkAssignAction;
  extraBulkItems?: () => MenuProps['items'];

  // ── Row Actions (tablo modunda kullanılır) ────────────────────────────────
  rowActions?: RowActionConfig<T>;

  // ── Table (renderContent tanımlı değilse zorunlu) ────────────────────────
  dataSource?: T[];
  columns?: TableProps<T>['columns'];
  rowKey?: string;
  loading?: boolean;
  tableScrollX?: number;
  onTableChange?: TableProps<T>['onChange'];
  onRowClick?: (record: T) => void;

  // ── Pagination (renderContent tanımlı değilse kullanılır) ────────────────
  page?: number;
  pageSize?: number;
  hasMore?: boolean;
  totalItems?: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;

  /**
   * Özel içerik render fonksiyonu.
   * Tanımlandığında tablo + pagination bloğunun yerine geçer.
   * Kanban, grid, timeline gibi tablo dışı görünümler için kullanılır.
   * Row actions ve selection bu modda layout tarafından yönetilmez;
   * kart/öğe bazlı aksiyonlar doğrudan renderContent içinde tanımlanmalıdır.
   */
  renderContent?: () => React.ReactNode;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveStr<T>(val: string | ((r: T) => string) | undefined, record: T, fallback: string): string {
  if (!val) return fallback;
  return typeof val === 'function' ? val(record) : val;
}

// ─── Component ────────────────────────────────────────────────────────────────

function ListPageLayout<T extends object>({
  title,
  subtitle,
  createButtonLabel,
  onCreate,
  renderExtraHeaderActions,

  searchPlaceholder,
  searchValue = '',
  onSearch,
  onSearchChange,
  hasActiveFilters,
  onResetFilters,
  onRefresh,
  renderExtraFilters,

  selectedRowKeys = [],
  onSelectionChange,
  onClearSelection,

  onBulkDelete,
  onBulkActivate,
  onBulkDeactivate,
  onBulkAssign,
  extraBulkItems,

  rowActions,

  dataSource = [],
  columns,
  rowKey = 'id',
  loading = false,
  tableScrollX,
  onTableChange,
  onRowClick,

  page = 1,
  pageSize = 10,
  hasMore = false,
  totalItems = 0,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,

  renderContent,
}: ListPageLayoutProps<T>) {
  const { t } = useTranslation();
  const resolvedCreateLabel = createButtonLabel ?? t('action.new');
  const resolvedSearchPlaceholder = searchPlaceholder ?? t('action.searchPlaceholder');

  const [filterVisible, setFilterVisible] = useState(false);
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);
  const [rowAssignRecord, setRowAssignRecord] = useState<T | null>(null);

  // ── Confirm helpers ───────────────────────────────────────────────────────
  const showConfirm = (title: string, content: string, onOk: () => void | Promise<void>) => {
    Modal.confirm({ title, content, okText: t('action.confirm'), cancelText: t('action.cancel'), onOk });
  };

  const showDangerConfirm = (title: string, content: string, onOk: () => void | Promise<void>) => {
    Modal.confirm({ title, content, okText: t('action.delete'), okType: 'danger', cancelText: t('action.cancel'), onOk });
  };

  // ── Bulk action runners ───────────────────────────────────────────────────
  const runBulkAction = (action: BulkAction, defaults: { title: string; content: string }) => {
    const title = action.confirm?.title ?? defaults.title;
    const content = action.confirm?.content
      ? action.confirm.content(selectedRowKeys.length)
      : defaults.content;
    showConfirm(title, content, action.handler);
  };

  const runBulkDelete = () => {
    if (!onBulkDelete) return;
    const title = onBulkDelete.confirm?.title ?? t('confirm.bulkDeleteTitle');
    const content = onBulkDelete.confirm?.content
      ? onBulkDelete.confirm.content(selectedRowKeys.length)
      : t('confirm.bulkDeleteContent', { count: selectedRowKeys.length });
    showDangerConfirm(title, content, onBulkDelete.handler);
  };

  const handleBulkAssignChange = async (entity: EntityReference | EntityReference[] | null) => {
    await onBulkAssign?.handler(entity);
    setBulkAssignOpen(false);
  };

  // ── Row action runners ────────────────────────────────────────────────────
  const runRowAction = (action: RowAction<T>, record: T, defaults: { title: string; content: string }) => {
    const title = resolveStr(action.confirm?.title, record, defaults.title);
    const content = resolveStr(action.confirm?.content, record, defaults.content);
    showConfirm(title, content, () => action.handler(record));
  };

  const runRowDelete = (record: T) => {
    if (!rowActions?.onDelete) return;
    const action = rowActions.onDelete;
    const title = resolveStr(action.confirm?.title, record, t('confirm.rowDeleteTitle'));
    const content = resolveStr(action.confirm?.content, record, t('confirm.rowDeleteContent'));
    showDangerConfirm(title, content, () => action.handler(record));
  };

  const handleRowAssignChange = async (entity: EntityReference | EntityReference[] | null) => {
    if (rowAssignRecord) await rowActions?.onAssign?.handler(rowAssignRecord, entity);
    setRowAssignRecord(null);
  };

  // ── Build row action items ────────────────────────────────────────────────
  const buildRowActionItems = (record: T): MenuProps['items'] => {
    if (!rowActions) return [];
    const items: MenuProps['items'] = [];

    if (rowActions.onView) {
      items.push({
        key: 'view', label: t('action.view'), icon: <EyeOutlined />,
        onClick: (info) => { info.domEvent.stopPropagation(); rowActions.onView!(record); },
      });
    }
    if (rowActions.onEdit) {
      items.push({
        key: 'edit', label: t('action.edit'), icon: <EditOutlined />,
        onClick: (info) => { info.domEvent.stopPropagation(); rowActions.onEdit!(record); },
      });
    }

    if (rowActions.isActiveResolver) {
      const isActive = rowActions.isActiveResolver(record);
      if (!isActive && rowActions.onActivate) {
        items.push({
          key: 'activate', label: t('action.activate'), icon: <CheckCircleOutlined />,
          onClick: (info) => {
            info.domEvent.stopPropagation();
            if (rowActions.onActivate!.confirm) {
              runRowAction(rowActions.onActivate!, record, { title: t('confirm.activateTitle'), content: t('confirm.activateContent') });
            } else {
              rowActions.onActivate!.handler(record);
            }
          },
        });
      }
      if (isActive && rowActions.onDeactivate) {
        items.push({
          key: 'deactivate', label: t('action.deactivate'), icon: <StopOutlined />,
          onClick: (info) => {
            info.domEvent.stopPropagation();
            if (rowActions.onDeactivate!.confirm) {
              runRowAction(rowActions.onDeactivate!, record, { title: t('confirm.deactivateTitle'), content: t('confirm.deactivateContent') });
            } else {
              rowActions.onDeactivate!.handler(record);
            }
          },
        });
      }
    } else {
      if (rowActions.onActivate) {
        items.push({
          key: 'activate', label: t('action.activate'), icon: <CheckCircleOutlined />,
          onClick: (info) => {
            info.domEvent.stopPropagation();
            if (rowActions.onActivate!.confirm) {
              runRowAction(rowActions.onActivate!, record, { title: t('confirm.activateTitle'), content: t('confirm.activateContent') });
            } else {
              rowActions.onActivate!.handler(record);
            }
          },
        });
      }
      if (rowActions.onDeactivate) {
        items.push({
          key: 'deactivate', label: t('action.deactivate'), icon: <StopOutlined />,
          onClick: (info) => {
            info.domEvent.stopPropagation();
            if (rowActions.onDeactivate!.confirm) {
              runRowAction(rowActions.onDeactivate!, record, { title: t('confirm.deactivateTitle'), content: t('confirm.deactivateContent') });
            } else {
              rowActions.onDeactivate!.handler(record);
            }
          },
        });
      }
    }

    if (rowActions.onAssign) {
      items.push({
        key: 'assign', label: t('action.assign'), icon: <UserAddOutlined />,
        onClick: (info) => { info.domEvent.stopPropagation(); setRowAssignRecord(record); },
      });
    }

    const extra = rowActions.extraItems?.(record) ?? [];
    if (extra.length > 0) {
      if (items.length > 0) items.push({ type: 'divider' });
      items.push(...extra);
    }

    if (rowActions.onDelete) {
      if (items.length > 0) items.push({ type: 'divider' });
      items.push({
        key: 'delete', label: t('action.delete'), icon: <DeleteOutlined />, danger: true,
        onClick: (info) => { info.domEvent.stopPropagation(); runRowDelete(record); },
      });
    }

    return items;
  };

  // ── Actions column ────────────────────────────────────────────────────────
  const actionsColumn: NonNullable<TableProps<T>['columns']> = rowActions
    ? [{
        title: '',
        key: '__row_actions',
        width: 60,
        fixed: 'right' as const,
        render: (_: unknown, record: T) => {
          const items = buildRowActionItems(record);
          if (!items?.length) return null;
          return (
            <Dropdown menu={{ items: items ?? [] }} trigger={['click']}>
              <Button type="text" icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
            </Dropdown>
          );
        },
      }]
    : [];

  const mergedColumns = [...(columns ?? []), ...actionsColumn];

  // ── Bulk menu ─────────────────────────────────────────────────────────────
  const hasBulkNonDelete = !!(onBulkActivate || onBulkDeactivate || onBulkAssign || (extraBulkItems?.()?.length ?? 0) > 0);

  const bulkMenuItems: MenuProps['items'] = [
    ...(onBulkActivate
      ? [{ key: 'activate', label: t('action.bulkActivate'), icon: <CheckCircleOutlined />,
           onClick: () => runBulkAction(onBulkActivate, { title: t('confirm.bulkActivateTitle'), content: t('confirm.bulkActivateContent', { count: selectedRowKeys.length }) }) }]
      : []),
    ...(onBulkDeactivate
      ? [{ key: 'deactivate', label: t('action.bulkDeactivate'), icon: <StopOutlined />,
           onClick: () => runBulkAction(onBulkDeactivate, { title: t('confirm.bulkDeactivateTitle'), content: t('confirm.bulkDeactivateContent', { count: selectedRowKeys.length }) }) }]
      : []),
    ...(onBulkAssign
      ? [{ key: 'assign', label: t('action.bulkAssign'), icon: <UserAddOutlined />, onClick: () => setBulkAssignOpen(true) }]
      : []),
    ...(extraBulkItems?.() ?? []),
    ...(onBulkDelete && hasBulkNonDelete ? [{ type: 'divider' as const }] : []),
    ...(onBulkDelete
      ? [{ key: 'delete', label: t('action.bulkDelete'), icon: <DeleteOutlined />, danger: true, onClick: runBulkDelete }]
      : []),
  ];

  // ── Row selection ─────────────────────────────────────────────────────────
  const rowSelection: TableRowSelection<T> = {
    selectedRowKeys,
    onChange: (keys) => onSelectionChange?.(keys as string[]),
    preserveSelectedRowKeys: true,
  };

  // ─────────────────────────────────────────────────────────────────────────

  const hasHeader = !!title || !!renderExtraHeaderActions || !!onCreate;

  return (
    <div style={{ padding: hasHeader ? 24 : '0 0 24px 0' }}>
      {/* ── Page Header ───────────────────────────────────────────────── */}
      {hasHeader && (
      <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>{title}</Title>
          {subtitle && <Text type="secondary">{subtitle}</Text>}
        </div>
        <Space>
          {renderExtraHeaderActions?.()}
          {onCreate && (
            <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
              {resolvedCreateLabel}
            </Button>
          )}
        </Space>
      </Flex>
      )}

      {/* ── Filters Card ──────────────────────────────────────────────── */}
      <Card style={{ marginBottom: 16 }} styles={{ body: { padding: '16px 24px' } }}>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <Space size="middle" wrap>
              {onSearch && (
                <Search
                  placeholder={resolvedSearchPlaceholder}
                  allowClear
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  onSearch={onSearch}
                  style={{ width: 280 }}
                  prefix={<SearchOutlined />}
                />
              )}
              {filterVisible && renderExtraFilters?.()}
            </Space>
          </Col>
          <Col>
            <Space>
              {renderExtraFilters && (
                <Tooltip title={filterVisible ? t('action.hideFilters') : t('action.showFilters')}>
                  <Button
                    icon={<FilterOutlined />}
                    type={filterVisible ? 'primary' : 'default'}
                    onClick={() => setFilterVisible((v) => !v)}
                  />
                </Tooltip>
              )}
              {hasActiveFilters && onResetFilters && (
                <Tooltip title={t('action.clearFilters')}>
                  <Button icon={<ClearOutlined />} onClick={onResetFilters} />
                </Tooltip>
              )}
              {onRefresh && (
                <Tooltip title={t('action.refresh')}>
                  <Button icon={<ReloadOutlined />} onClick={onRefresh} />
                </Tooltip>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* ── Bulk Actions Bar (sadece tablo modunda, seçili kayıt varsa) ── */}
      {!renderContent && selectedRowKeys.length > 0 && (
        <Card
          style={{ marginBottom: 16, background: '#e6f7ff', borderColor: '#91d5ff' }}
          styles={{ body: { padding: '12px 24px' } }}
        >
          <Flex justify="space-between" align="center">
            <Space>
              <Text strong>{t('selection.selected', { count: selectedRowKeys.length })}</Text>
              <Button type="link" size="small" onClick={onClearSelection}>{t('action.clearSelection')}</Button>
            </Space>
            {bulkMenuItems.length > 0 && (
              <Dropdown menu={{ items: bulkMenuItems }} trigger={['click']}>
                <Button type="primary">
                  <Space>{t('action.bulkActions')}<MoreOutlined /></Space>
                </Button>
              </Dropdown>
            )}
          </Flex>

          {onBulkAssign && (
            <EntityLookup
              open={bulkAssignOpen}
              onOpenChange={setBulkAssignOpen}
              onSearch={entitySearchService.search}
              entityTypes={[EntityType.User]}
              multiple={false}
              modalTitle={t('action.assignUser')}
              onChange={handleBulkAssignChange}
            />
          )}
        </Card>
      )}

      {/* ── Content: özel (renderContent) veya tablo ─────────────────── */}
      {renderContent ? (
        renderContent()
      ) : (
        <Card styles={{ body: { padding: 0 } }}>
          <Table<T>
            rowKey={rowKey}
            columns={mergedColumns}
            dataSource={dataSource}
            loading={loading}
            rowSelection={rowSelection}
            pagination={false}
            onChange={onTableChange}
            onRow={
              onRowClick
                ? (record) => ({ onClick: () => onRowClick(record), style: { cursor: 'pointer' } })
                : undefined
            }
            scroll={tableScrollX ? { x: tableScrollX } : undefined}
            size="middle"
          />
          <CustomPagination
            current={page}
            pageSize={pageSize}
            hasMore={hasMore}
            totalItems={totalItems}
            pageSizeOptions={pageSizeOptions}
            onPageChange={onPageChange ?? (() => {})}
            onPageSizeChange={onPageSizeChange ?? (() => {})}
          />
        </Card>
      )}

      {/* Row-level assign modal */}
      {rowActions?.onAssign && (
        <EntityLookup
          open={rowAssignRecord !== null}
          onOpenChange={(open) => { if (!open) setRowAssignRecord(null); }}
          onSearch={entitySearchService.search}
          entityTypes={[EntityType.User]}
          multiple={false}
          modalTitle="Kullanıcı ata..."
          onChange={handleRowAssignChange}
        />
      )}
    </div>
  );
}

export default ListPageLayout;