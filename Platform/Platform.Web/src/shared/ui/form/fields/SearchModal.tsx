import { useCallback, useEffect, useRef, useState } from 'react';
import { Input, List, Modal, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { httpClient } from '../../../api/httpClient';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import type { EntityReference } from '../../../types/EntityReference';
import type { PagedResult } from '../../../types/Pagination';

export interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (ref: EntityReference) => void;
  /** Backend search endpoint — `ServicePath.Account.Search` gibi. */
  servicePath: string;
  title: string;
  pageSize?: number;
  debounceMs?: number;
  initialSearchText?: string;
  /** Liste içinde gizlenecek id'ler — örn. zaten eklenmiş olanlar. */
  excludeIds?: ReadonlySet<string>;
}

/**
 * Backend `EntityReference` arama modal'ı. `EntityLookupField` ve
 * `EntityRelationTable` tarafından paylaşılır.
 *
 * Backend sözleşmesi:
 *   POST {servicePath}  body: { searchText, pagination: { pageNumber, pageSize } }
 *   → PagedResult<EntityReference>
 */
export function SearchModal({
  open,
  onClose,
  onSelect,
  servicePath,
  title,
  pageSize = 20,
  debounceMs = 300,
  initialSearchText = '',
  excludeIds,
}: SearchModalProps) {
  const { t } = useTranslation('common');
  const [searchText, setSearchText] = useState(initialSearchText);
  const debouncedText = useDebouncedValue(searchText, debounceMs);

  const [items, setItems] = useState<EntityReference[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMoreRecord, setHasMoreRecord] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const fetchPage = useCallback(
    async (text: string, page: number) => {
      const response = await httpClient.post<PagedResult<EntityReference>>(servicePath, {
        searchText: text,
        pagination: { pageNumber: page, pageSize },
      });
      return {
        items: response.data.data,
        hasMoreRecord: response.data.pagination.hasMoreRecord,
      };
    },
    [servicePath, pageSize],
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
    if (open) setSearchText(initialSearchText);
  }, [open, initialSearchText]);

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

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={title}
      footer={null}
      width={560}
      destroyOnHidden
    >
      <Input
        autoFocus
        allowClear
        prefix={<SearchOutlined />}
        placeholder={t('actions.search')}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 12 }}
      />
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
          renderItem={(item) => (
            <List.Item
              onClick={() => onSelect(item)}
              style={{ cursor: 'pointer', padding: '8px 12px' }}
              className="entity-lookup-row"
            >
              <List.Item.Meta
                title={<span style={{ fontWeight: 500 }}>{item.name}</span>}
                description={
                  item.email || item.phone ? (
                    <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
                      {item.email ?? item.phone}
                    </span>
                  ) : null
                }
              />
            </List.Item>
          )}
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
