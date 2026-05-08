import { useState } from 'react';
import { Button, Checkbox, Form, Input, Space, Table, Tag, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  useFieldArray,
  type Control,
  type FieldValues,
  type ArrayPath,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { EntityReference } from '../../../types/EntityReference';
import type { FormMode } from '../../../types/FormMode';
import { useFormMode } from '../useFormMode';
import { SearchModal } from './SearchModal';

const { Text } = Typography;

/**
 * Junction-row tipinin tek satırı. `keyField` / `keyNameField` props ile
 * hangi alanların entity-id ve display-name olduğu çağıran tarafça verilir.
 *
 * Örn. Account → Contacts:
 *   { id, contactId, contactName, role, isPrimary }
 *
 * Örn. Contact → Accounts:
 *   { id, accountId, accountName, role, isPrimary }
 */
type JunctionRow = Record<string, unknown> & {
  id: string;
  role?: string | null;
  isPrimary: boolean;
};

export interface EntityRelationTableProps<TValues extends FieldValues> {
  /** Form alanının yolu — `'contacts'` veya `'accountContacts'`. */
  name: ArrayPath<TValues>;
  control: Control<TValues>;
  /** Hedef entity arama endpoint'i — `ServicePath.Contact.Search` gibi. */
  servicePath: string;

  /** Junction satırında ilişkili entity'nin id alan adı: `'contactId'` | `'accountId'`. */
  keyField: string;
  /** Junction satırında ilişkili entity'nin display alan adı: `'contactName'` | `'accountName'`. */
  keyNameField: string;

  label?: string;
  /** Add butonu metni. */
  addLabel?: string;
  /** Modal başlığı — verilmezse `addLabel` veya genel "Ara" kullanılır. */
  modalTitle?: string;

  /** İsim kolonu başlığı (örn. "Kontak Adı" / "Firma Adı"). */
  nameColumnTitle?: string;
  /** Role kolonu başlığı. */
  roleColumnTitle?: string;
  /** IsPrimary kolonu başlığı. */
  primaryColumnTitle?: string;

  /** Client_Architecture §8 — mode override hiyerarşisi. */
  force?: 'readonly' | 'editable';
  hideInMode?: FormMode[];
}

/**
 * Junction tablosu (Account ↔ Contact gibi many-to-many + ilişki metadata) için
 * mode-aware satır editörü.
 *
 * Kullanım:
 * ```tsx
 * <EntityRelationTable<AccountFormValues>
 *   name="contacts"
 *   control={form.control}
 *   servicePath={ServicePath.Contact.Search}
 *   keyField="contactId"
 *   keyNameField="contactName"
 * />
 * ```
 *
 * Form değeri her zaman `JunctionRow[]`. View modda salt okunur tablo.
 * IsPrimary tek-açık (radio davranışı): bir satır primary yapılınca diğerleri kapanır.
 */
export function EntityRelationTable<TValues extends FieldValues>({
  name,
  control,
  servicePath,
  keyField,
  keyNameField,
  label,
  addLabel,
  modalTitle,
  nameColumnTitle,
  roleColumnTitle,
  primaryColumnTitle,
  force,
  hideInMode,
}: EntityRelationTableProps<TValues>) {
  const { mode } = useFormMode();
  const { t } = useTranslation('common');
  const [modalOpen, setModalOpen] = useState(false);

  const { fields, append, remove, update } = useFieldArray<TValues>({
    control,
    name,
  });

  if (hideInMode?.includes(mode)) return null;

  const isViewMode = force === 'readonly' || (force !== 'editable' && mode === 'view');

  const rows = fields as unknown as Array<JunctionRow & { id: string }>;
  const excludeIds = new Set<string>(
    rows
      .map((r) => r[keyField])
      .filter((v): v is string => typeof v === 'string' && v !== ''),
  );

  const handleAdd = (ref: EntityReference) => {
    const newRow: JunctionRow = {
      id: '',
      [keyField]: ref.id,
      [keyNameField]: ref.name,
      role: null,
      isPrimary: rows.length === 0,
    };
    append(newRow as Parameters<typeof append>[0]);
    setModalOpen(false);
  };

  const handleSetPrimary = (index: number, value: boolean) => {
    rows.forEach((row, i) => {
      const next = { ...row, isPrimary: value && i === index };
      update(i, next as Parameters<typeof update>[1]);
    });
  };

  const handleRoleChange = (index: number, value: string) => {
    const row = rows[index];
    update(index, { ...row, role: value || null } as Parameters<typeof update>[1]);
  };

  type Row = JunctionRow & { __key: string; __index: number };

  const dataSource: Row[] = rows.map((row, index) => ({
    ...row,
    __key: (row as { id?: string }).id || `__new_${index}`,
    __index: index,
  }));

  const columns = [
    {
      title: nameColumnTitle ?? t('relation.name'),
      key: 'name',
      render: (_v: unknown, row: Row) => {
        const display = row[keyNameField] as string | null | undefined;
        return display ? <Text>{display}</Text> : <Text type="secondary">—</Text>;
      },
    },
    {
      title: roleColumnTitle ?? t('relation.role'),
      key: 'role',
      width: 220,
      render: (_v: unknown, row: Row) =>
        isViewMode ? (
          row.role ? <Text>{row.role}</Text> : <Text type="secondary">—</Text>
        ) : (
          <Input
            value={row.role ?? ''}
            onChange={(e) => handleRoleChange(row.__index, e.target.value)}
            placeholder={t('relation.role')}
            maxLength={200}
          />
        ),
    },
    {
      title: primaryColumnTitle ?? t('relation.primary'),
      key: 'isPrimary',
      width: 100,
      align: 'center' as const,
      render: (_v: unknown, row: Row) =>
        isViewMode ? (
          row.isPrimary ? <Tag color="blue">★</Tag> : null
        ) : (
          <Checkbox
            checked={row.isPrimary}
            onChange={(e) => handleSetPrimary(row.__index, e.target.checked)}
          />
        ),
    },
    ...(isViewMode
      ? []
      : [
          {
            title: '',
            key: '__actions',
            width: 60,
            align: 'center' as const,
            render: (_v: unknown, row: Row) => (
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => remove(row.__index)}
              />
            ),
          },
        ]),
  ];

  return (
    <Form.Item label={label} style={{ marginBottom: 16 }}>
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        <Table<Row>
          rowKey="__key"
          size="small"
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          locale={{
            emptyText: (
              <Text type="secondary" style={{ fontSize: 12 }}>
                {t('messages.noData')}
              </Text>
            ),
          }}
        />
        {!isViewMode && (
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
            block
          >
            {addLabel ?? t('relation.addRow')}
          </Button>
        )}
      </Space>
      <SearchModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleAdd}
        servicePath={servicePath}
        title={modalTitle ?? addLabel ?? label ?? t('actions.search')}
        excludeIds={excludeIds}
      />
    </Form.Item>
  );
}
