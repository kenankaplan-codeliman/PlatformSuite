import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, List, Modal, Select, Space, Spin, Tag, Typography } from 'antd';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { httpClient } from '../../../api/httpClient';
import { ServicePath } from '../../../api/servicePaths';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import type { EntityReference } from '../../../types/EntityReference';
import type { PagedResult } from '../../../types/Pagination';

/**
 * Bir arama hedef türü. Tek-tip mod için: tek bir option ve `servicePath` set edilir
 * (geriye dönük uyum). Çoklu-tip mod için: birden fazla option ve her biri için
 * `entityType` set edilir; `Reference.Lookup` üzerinden registry tarafından çözülür.
 */
export interface SearchModalEntityOption {
  /** Polimorfik anahtar (User, Account, Contact, Lead, Supplier, ...). */
  entityType: string;
  /** UI etiketi (i18n çağırımı caller tarafından yapılır). */
  label: string;
  /** Opsiyonel ikon. */
  icon?: React.ReactNode;
  /** Opsiyonel chip rengi. */
  color?: string;
  /**
   * Geriye dönük: bu tür için aramada kullanılacak entity-spesifik endpoint.
   * Verilmezse `Reference.Lookup` (registry) kullanılır.
   */
  servicePath?: string;
}

export interface SearchModalProps {
  open: boolean;
  onClose: () => void;

  /** Tek seçim için: bir öğeye tıklayınca onSelect çağrılır, modal kapanır. */
  onSelect?: (ref: EntityReference) => void;
  /** Çoklu seçim için: "Tamam"a basıldığında çağrılır. */
  onConfirm?: (refs: EntityReference[]) => void;

  /** Aranabilir entity türleri (en az bir öğe). */
  entityOptions: SearchModalEntityOption[];

  title: string;
  pageSize?: number;
  debounceMs?: number;
  initialSearchText?: string;

  /** Liste içinde gizlenecek id'ler — örn. zaten eklenmiş olanlar. */
  excludeIds?: ReadonlySet<string>;

  /** Çoklu seçim modu. */
  multiple?: boolean;
  /** Çoklu seçim için ön-seçili öğeler. */
  initialSelected?: EntityReference[];
  /** Çoklu seçim için maksimum öğe sayısı. */
  maxSelections?: number;
}

const { Text } = Typography;

/**
 * Backend `EntityReference` arama modal'ı. `EntityLookupField` ve
 * `EntityRelationTable` tarafından paylaşılır.
 *
 * Dört mod:
 *  - Tek-tip + tek-seçim: `entityOptions` tek öğe, `multiple` false (varsayılan).
 *  - Tek-tip + çoklu-seçim: `entityOptions` tek öğe, `multiple` true.
 *  - Çoklu-tip + tek-seçim: `entityOptions` çoklu, üst kısımda tip selector.
 *  - Çoklu-tip + çoklu-seçim: tip selector + multiselect liste.
 *
 * Endpoint sözleşmesi:
 *  - Option.servicePath set edilirse  → POST {servicePath} body: { searchText, pagination }
 *  - Option.servicePath set edilmezse → POST /api/reference/lookup body: { entityType, searchText, pagination }
 */
export function SearchModal({
  open,
  onClose,
  onSelect,
  onConfirm,
  entityOptions,
  title,
  pageSize = 20,
  debounceMs = 300,
  initialSearchText = '',
  excludeIds,
  multiple = false,
  initialSelected,
  maxSelections,
}: SearchModalProps) {
  const { t } = useTranslation('common');

  const [searchText, setSearchText] = useState(initialSearchText);
  const debouncedText = useDebouncedValue(searchText, debounceMs);
  const [activeType, setActiveType] = useState<string>(entityOptions[0]?.entityType ?? '');

  const [items, setItems] = useState<EntityReference[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMoreRecord, setHasMoreRecord] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<EntityReference[]>(initialSelected ?? []);
  const listRef = useRef<HTMLDivElement | null>(null);

  const activeOption = useMemo(
    () => entityOptions.find((o) => o.entityType === activeType) ?? entityOptions[0],
    [entityOptions, activeType],
  );

  const fetchPage = useCallback(
    async (text: string, page: number) => {
      if (!activeOption) return { items: [] as EntityReference[], hasMoreRecord: false };
      const body = activeOption.servicePath
        ? { searchText: text, pagination: { pageNumber: page, pageSize } }
        : { entityType: activeOption.entityType, searchText: text, pagination: { pageNumber: page, pageSize } };
      const url = activeOption.servicePath ?? ServicePath.Reference.Lookup;
      const response = await httpClient.post<PagedResult<EntityReference>>(url, body);
      // Backend bazı durumlarda EntityReference.entityType göndermeyebilir;
      // burada deterministik olsun diye seçili türle imzalıyoruz.
      const stamped = response.data.data.map((r) =>
        r.entityType ? r : { ...r, entityType: activeOption.entityType },
      );
      return {
        items: stamped,
        hasMoreRecord: response.data.pagination.hasMoreRecord,
      };
    },
    [activeOption, pageSize],
  );

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setIsLoading(true);
    (async () => {
      try {
        const result = await fetchPage(debouncedText, 1);
        if (cancelled) return;
        setItems(result.items);
        setHasMoreRecord(result.hasMoreRecord);
        setPageNumber(1);
        if (listRef.current) listRef.current.scrollTop = 0;
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, debouncedText, fetchPage]);

  useEffect(() => {
    if (!open) return;
    setSearchText(initialSearchText);
    setActiveType(entityOptions[0]?.entityType ?? '');
    setSelected(initialSelected ?? []);
  }, [open, initialSearchText, entityOptions, initialSelected]);

  const handleScroll = useCallback(
    async (event: React.UIEvent<HTMLDivElement>) => {
      const el = event.currentTarget;
      const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8;
      if (!isAtBottom || !hasMoreRecord || isLoading) return;
      setIsLoading(true);
      try {
        const nextPage = pageNumber + 1;
        const result = await fetchPage(debouncedText, nextPage);
        setItems((prev) => [...prev, ...result.items]);
        setHasMoreRecord(result.hasMoreRecord);
        setPageNumber(nextPage);
      } finally {
        setIsLoading(false);
      }
    },
    [debouncedText, fetchPage, hasMoreRecord, isLoading, pageNumber],
  );

  const visibleItems = excludeIds
    ? items.filter((item) => !excludeIds.has(item.id))
    : items;

  const isSelected = (id: string) => selected.some((s) => s.id === id);

  const handleItemClick = (item: EntityReference) => {
    if (multiple) {
      if (isSelected(item.id)) {
        setSelected((prev) => prev.filter((s) => s.id !== item.id));
      } else if (!maxSelections || selected.length < maxSelections) {
        setSelected((prev) => [...prev, item]);
      }
    } else {
      onSelect?.(item);
    }
  };

  const handleRemoveSelected = (id: string) => {
    setSelected((prev) => prev.filter((s) => s.id !== id));
  };

  const handleConfirm = () => onConfirm?.(selected);

  const typeSelectOptions = useMemo(
    () =>
      entityOptions.map((opt) => ({
        value: opt.entityType,
        label: (
          <Space size={4}>
            {opt.icon}
            <span>{opt.label}</span>
          </Space>
        ),
      })),
    [entityOptions],
  );

  const hasMultipleTypes = entityOptions.length > 1;

  const displayTitle =
    hasMultipleTypes && activeOption
      ? `${activeOption.label} ${t('actions.search')}`
      : title;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={displayTitle}
      footer={
        multiple ? (
          <Space>
            <Text type="secondary">
              {t('messages.selectedCount', { count: selected.length })}
              {maxSelections ? ` (max: ${maxSelections})` : null}
            </Text>
            <Button onClick={onClose}>{t('actions.cancel')}</Button>
            <Button type="primary" onClick={handleConfirm}>
              {t('actions.ok')}
            </Button>
          </Space>
        ) : null
      }
      width={620}
      destroyOnHidden
    >
      <Space.Compact style={{ display: 'flex', marginBottom: 12 }}>
        {hasMultipleTypes && (
          <Select
            value={activeType}
            onChange={(v) => setActiveType(v)}
            options={typeSelectOptions}
            style={{ width: 180, flex: '0 0 auto' }}
          />
        )}
        <Input
          autoFocus
          allowClear
          prefix={<SearchOutlined />}
          placeholder={t('actions.search')}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ flex: 1 }}
        />
      </Space.Compact>
      {multiple && selected.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            marginBottom: 12,
            padding: 8,
            border: '1px dashed #f0f0f0',
            borderRadius: 4,
          }}
        >
          {selected.map((s) => (
            <Tag
              key={s.id}
              closable
              closeIcon={<CloseOutlined />}
              onClose={(e) => {
                e.preventDefault();
                handleRemoveSelected(s.id);
              }}
              color="blue"
            >
              {s.name}
            </Tag>
          ))}
        </div>
      )}
      <div
        ref={listRef}
        onScroll={handleScroll}
        style={{ maxHeight: 360, overflowY: 'auto', border: '1px solid #f0f0f0', borderRadius: 4 }}
      >
        <List
          dataSource={visibleItems}
          locale={{
            emptyText: isLoading ? <Spin size="small" /> : t('messages.noData'),
          }}
          renderItem={(item) => {
            const sel = isSelected(item.id);
            return (
              <List.Item
                onClick={() => handleItemClick(item)}
                style={{
                  cursor: 'pointer',
                  padding: '8px 12px',
                  background: sel ? '#e6f7ff' : undefined,
                }}
                className="entity-lookup-row"
              >
                <List.Item.Meta
                  title={
                    <Space size={6}>
                      <span style={{ fontWeight: 500 }}>{item.name}</span>
                      {sel && <Tag color="blue">{t('messages.selected')}</Tag>}
                    </Space>
                  }
                  description={
                    item.email || item.phone ? (
                      <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
                        {item.email ?? item.phone}
                      </span>
                    ) : null
                  }
                />
              </List.Item>
            );
          }}
        />
        {isLoading && visibleItems.length > 0 && (
          <div style={{ textAlign: 'center', padding: 8 }}>
            <Spin size="small" />
          </div>
        )}
      </div>
    </Modal>
  );
}
