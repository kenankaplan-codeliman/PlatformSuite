import { useMemo, useState } from 'react';
import { Button, Form, Tag, Space } from 'antd';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useErrorMessage } from '../../../lib/i18n/errorMessage';
import { useEntityTypeRegistry } from '../../../lib/entity-type/EntityTypeRegistryContext';
import { toneToTagColor } from '../../../lib/entity-type/tone';
import type { EntityReference } from '../../../types/EntityReference';
import type { FormMode } from '../../../types/FormMode';
import type { FormRowItemProps } from '../FormRow';
import { useFormMode } from '../useFormMode';
import { SearchModal, type SearchModalEntityOption } from './SearchModal';

/**
 * `EntityLookupField` aramada hedef alabileceği bir entity türü:
 *  - `entityType`: polimorfik anahtar (User, Account, Contact, Lead, Supplier, ...).
 *  - `label`: dropdown'da gösterilecek etiket (i18n çağırımı caller'a ait).
 *  - `icon` / `color`: opsiyonel görsel.
 *  - `servicePath`: opsiyonel — verilirse o tür için entity-spesifik search endpoint
 *    (örn. `ServicePath.Account.Search`) kullanılır; verilmezse `Reference.Lookup` üzerinden
 *    registry tarafından çözülür (önerilen — yeni eklenen entity'ler için endpoint yazmaya gerek yok).
 */
export type EntityLookupOption = SearchModalEntityOption;

export interface EntityLookupFieldProps<TValues extends FieldValues> extends FormRowItemProps {
  name: string;
  control: Control<TValues>;
  /**
   * Tek-tip mod (geriye dönük): tek bir search endpoint URL'i. Bu mod ile birlikte
   * `entityTypes` verilmez. Form değeri tek `EntityReference | null` (multiple=false varsayılan)
   * veya `EntityReference[]` (multiple=true).
   */
  servicePath?: string;
  /** Tek-tip + servicePath modunda EntityReference.entityType alanına yazılacak değer. */
  entityType?: string;

  /**
   * Çoklu-tip mod: aranabilecek türler. En az 1 öğe verilmelidir.
   * `entityTypes.length > 1` ise modal'da bir tip selector gösterilir.
   * Servis çağrısı ya option.servicePath'e ya da `/api/reference/lookup`'a gider.
   */
  entityTypes?: EntityLookupOption[];

  /** Çoklu seçim. Form değeri `EntityReference[]`. */
  multiple?: boolean;
  /** Çoklu seçim için max kayıt. */
  maxSelections?: number;

  label?: string;
  placeholder?: string;
  required?: boolean;
  allowClear?: boolean;

  pageSize?: number;
  debounceMs?: number;

  modalTitle?: string;

  /** Client_Architecture §8 — mode override hiyerarşisi. */
  force?: 'readonly' | 'editable';
  hideInMode?: FormMode[];
  requiredInMode?: FormMode[];
}

/**
 * Mode-aware entity lookup primitifi. Üç davranış kombinasyonunu tek bileşende
 * tutar:
 *
 *  1. Tek-tip + tek-seçim:
 *     <EntityLookupField servicePath={ServicePath.User.Search} entityType="User" .../>
 *
 *  2. Tek-tip + çoklu-seçim:
 *     <EntityLookupField servicePath={ServicePath.Contact.Search} entityType="Contact" multiple .../>
 *
 *  3. Çoklu-tip (single ya da multiple):
 *     <EntityLookupField entityTypes={[
 *        { entityType: 'Account',     label: 'Firma' },
 *        { entityType: 'Contact',     label: 'Kişi' },
 *        { entityType: 'Lead',        label: 'Aday' },
 *        { entityType: 'Opportunity', label: 'Fırsat' },
 *     ]} multiple .../>
 *
 * Form değeri:
 *  - multiple=false → `EntityReference | null`
 *  - multiple=true  → `EntityReference[]`
 */
export function EntityLookupField<TValues extends FieldValues>({
  name,
  control,
  servicePath,
  entityType,
  entityTypes,
  multiple = false,
  maxSelections,
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
  const entityTypeRegistry = useEntityTypeRegistry();

  const [modalOpen, setModalOpen] = useState(false);

  const entityOptions = useMemo<EntityLookupOption[]>(() => {
    if (entityTypes && entityTypes.length > 0) return entityTypes;
    if (servicePath) {
      return [
        {
          entityType: entityType ?? 'Entity',
          label: label ?? entityType ?? t('actions.search'),
          servicePath,
        },
      ];
    }
    // Fallback: registry-only single option, but caller must pass entityType.
    return entityType
      ? [{ entityType, label: label ?? entityType }]
      : [];
  }, [entityTypes, servicePath, entityType, label, t]);

  if (hideInMode?.includes(mode)) return null;

  const isViewMode = force === 'readonly' || (force !== 'editable' && mode === 'view');
  const effectiveRequired = required || requiredInMode?.includes(mode);
  const dialogTitle = modalTitle ?? label ?? t('actions.search');

  return (
    <Controller
      name={name as Path<TValues>}
      control={control}
      render={({ field, fieldState }) => {
        const rawValue = field.value as EntityReference | EntityReference[] | null | undefined;
        const valueArray: EntityReference[] = multiple
          ? Array.isArray(rawValue)
            ? rawValue
            : []
          : rawValue && !Array.isArray(rawValue)
            ? [rawValue]
            : [];

        const writeValue = (next: EntityReference[]) => {
          if (multiple) {
            field.onChange(next);
          } else {
            field.onChange(next[0] ?? null);
          }
        };

        const handleSingleSelect = (ref: EntityReference) => {
          writeValue([ref]);
          setModalOpen(false);
        };

        const handleMultiConfirm = (refs: EntityReference[]) => {
          writeValue(refs);
          setModalOpen(false);
        };

        const handleClearAll = () => writeValue([]);

        const handleRemoveOne = (id: string) => {
          writeValue(valueArray.filter((v) => v.id !== id));
        };

        const renderTags = () => {
          if (valueArray.length === 0) return null;
          return (
            <Space wrap size={4}>
              {valueArray.map((v) => {
                const meta = entityTypeRegistry.get(v.entityType);
                const Icon = meta?.icon;
                const href = meta?.getDetailHref?.(v.id);
                const tag = (
                  <Tag
                    color={toneToTagColor(meta?.tone)}
                    closable={!isViewMode}
                    onClose={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveOne(v.id);
                    }}
                    icon={Icon ? <Icon /> : undefined}
                    style={{
                      marginRight: 0,
                      fontSize: 13,
                      padding: '0 8px',
                      cursor: href ? 'pointer' : 'default',
                    }}
                  >
                    {v.name}
                  </Tag>
                );
                if (!href) {
                  return <span key={v.id}>{tag}</span>;
                }
                return (
                  <Link
                    key={v.id}
                    to={href}
                    onClick={(e) => e.stopPropagation()}
                    style={{ display: 'inline-flex', textDecoration: 'none' }}
                  >
                    {tag}
                  </Link>
                );
              })}
            </Space>
          );
        };

        return (
          <Form.Item
            label={label}
            required={effectiveRequired && !isViewMode}
            validateStatus={fieldState.error ? 'error' : undefined}
            help={translateError(fieldState.error?.message)}
          >
            {isViewMode ? (
              valueArray.length > 0 ? (
                renderTags()
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
                  {valueArray.length > 0 ? (
                    renderTags()
                  ) : (
                    <span style={{ color: 'rgba(0,0,0,0.25)' }}>
                      {placeholder ?? t('actions.search')}
                    </span>
                  )}
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {allowClear && valueArray.length > 0 && (
                      <Button
                        type="text"
                        size="small"
                        icon={<CloseOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearAll();
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
                {entityOptions.length > 0 && (
                  <SearchModal
                    open={modalOpen}
                    onClose={() => {
                      setModalOpen(false);
                      field.onBlur();
                    }}
                    onSelect={handleSingleSelect}
                    onConfirm={handleMultiConfirm}
                    entityOptions={entityOptions}
                    title={dialogTitle}
                    pageSize={pageSize}
                    debounceMs={debounceMs}
                    multiple={multiple}
                    initialSelected={multiple ? valueArray : undefined}
                    maxSelections={maxSelections}
                  />
                )}
              </>
            )}
          </Form.Item>
        );
      }}
    />
  );
}
