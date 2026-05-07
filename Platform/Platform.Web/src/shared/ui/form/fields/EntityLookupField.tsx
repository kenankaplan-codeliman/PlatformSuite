import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, List, Modal, Spin, Tag } from 'antd';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { httpClient } from '../../../api/httpClient';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { useErrorMessage } from '../../../lib/i18n/errorMessage';
import type { EntityReference } from '../../../types/EntityReference';
import type { FormMode } from '../../../types/FormMode';
import type { PagedResult } from '../../../types/Pagination';
import type { FormRowItemProps } from '../FormRow';
import { useFormMode } from '../useFormMode';

export interface EntityLookupFieldProps<TValues extends FieldValues> extends FormRowItemProps {
  /**
   * Form alanının yolu. Component sadece `EntityReference | null` ile çalışır;
   * `name`'in tip güvenliği yerine sade çağrı tercih edildi. Generic `TValues`
   * sadece `control` prop'undan **infer** etmek için var — caller `<TValues>`
   * specifier vermek zorunda değil.
   */
  name: string;
  control: Control<TValues>;
  /** Backend search endpoint — `ServicePath.Account.Search` gibi. */
  servicePath: string;

  label?: string;
  placeholder?: string;
  required?: boolean;
  allowClear?: boolean;

  pageSize?: number;
  debounceMs?: number;

  /** Modal başlığı — verilmezse `label` veya genel "Ara" kullanılır. */
  modalTitle?: string;

  /** Client_Architecture §8 — mode override hiyerarşisi. */
  force?: 'readonly' | 'editable';
  hideInMode?: FormMode[];
  requiredInMode?: FormMode[];
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (ref: EntityReference) => void;
  servicePath: string;
  title: string;
  pageSize: number;
  debounceMs: number;
  initialSearchText?: string;
}

function SearchModal({
  open,
  onClose,
  onSelect,
  servicePath,
  title,
  pageSize,
  debounceMs,
  initialSearchText = '',
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
          dataSource={items}
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
        {isLoading && items.length > 0 && (
          <div style={{ textAlign: 'center', padding: 8 }}>
            <Spin size="small" />
          </div>
        )}
      </div>
    </Modal>
  );
}

/**
 * Mode-aware entity lookup primitifi — Client_Architecture §8.
 *
 * Backend sözleşmesi:
 *   POST {servicePath}  body: { searchText, pagination: { pageNumber, pageSize } }
 *   → PagedResult<EntityReference>
 *
 * UX: Form değeri kutu içinde Tag olarak gösterilir; sağdaki "Ara" butonu
 * arama modal'ını açar. Modal içinde arama input + paginated list. Bir
 * öğeye tıklamak değeri set eder ve modal'ı kapatır. Clear butonu ile
 * değer null'a çekilir.
 *
 * Form değeri her zaman `EntityReference | null`.
 */
export function EntityLookupField<TValues extends FieldValues>({
  name,
  control,
  servicePath,
  label,
  placeholder,
  required,
  allowClear = true,
  pageSize = 20,
  debounceMs = 300,
  modalTitle,
  force,
  hideInMode,
  requiredInMode,
}: EntityLookupFieldProps<TValues>) {
  const { mode } = useFormMode();
  const translateError = useErrorMessage();
  const { t } = useTranslation('common');

  const [modalOpen, setModalOpen] = useState(false);

  if (hideInMode?.includes(mode)) return null;

  const isViewMode = force === 'readonly' || (force !== 'editable' && mode === 'view');
  const effectiveRequired = required || requiredInMode?.includes(mode);
  const dialogTitle = modalTitle ?? label ?? t('actions.search');

  return (
    <Controller
      name={name as Path<TValues>}
      control={control}
      render={({ field, fieldState }) => {
        const value = field.value as EntityReference | null | undefined;
        const displayLabel = value?.name;

        const handleSelect = (ref: EntityReference) => {
          field.onChange(ref);
          setModalOpen(false);
        };

        const handleClear = () => {
          field.onChange(null);
        };

        return (
          <Form.Item
            label={label}
            required={effectiveRequired && !isViewMode}
            validateStatus={fieldState.error ? 'error' : undefined}
            help={translateError(fieldState.error?.message)}
          >
            {isViewMode ? (
              displayLabel ? (
                <Tag color="blue" style={{ fontSize: 13, padding: '2px 10px' }}>
                  {displayLabel}
                </Tag>
              ) : (
                <span style={{ color: 'rgba(0,0,0,0.45)' }}>—</span>
              )
            ) : (
              <>
                <div
                  onClick={() => setModalOpen(true)}
                  style={{
                    minHeight: 32,
                    padding: '4px 8px',
                    border: fieldState.error ? '1px solid #ff4d4f' : '1px solid #d9d9d9',
                    borderRadius: 6,
                    background: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}
                >
                  {displayLabel ? (
                    <Tag
                      color="blue"
                      style={{ marginRight: 0, fontSize: 13, padding: '0 8px' }}
                    >
                      {displayLabel}
                    </Tag>
                  ) : (
                    <span style={{ color: 'rgba(0,0,0,0.25)' }}>
                      {placeholder ?? t('actions.search')}
                    </span>
                  )}
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {allowClear && displayLabel && (
                      <Button
                        type="text"
                        size="small"
                        icon={<CloseOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClear();
                        }}
                      />
                    )}
                    <Button
                      type="text"
                      size="small"
                      icon={<SearchOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalOpen(true);
                      }}
                    />
                  </span>
                </div>
                <SearchModal
                  open={modalOpen}
                  onClose={() => {
                    setModalOpen(false);
                    field.onBlur();
                  }}
                  onSelect={handleSelect}
                  servicePath={servicePath}
                  title={dialogTitle}
                  pageSize={pageSize}
                  debounceMs={debounceMs}
                />
              </>
            )}
          </Form.Item>
        );
      }}
    />
  );
}
