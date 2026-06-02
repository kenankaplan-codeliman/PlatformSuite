import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import {
  useFieldArray,
  useWatch,
  type ArrayPath,
  type Control,
  type FieldArray,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { Button } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { FormMode } from '../../../types/FormMode';
import { useFormMode } from '../useFormMode';
import { EmptyState } from '../../feedback/EmptyState';

/**
 * Editable satır koleksiyonu için generic primitive — `useFieldArray` üzerine
 * column template'li bir grid. Her satır kalemi (line item) tablosu (Opportunity
 * products, communication emails/phones, vb.) bu primitive'i kullanır.
 *
 * Tasarım kontratı:
 *  - Column'a "hangi field componenti" verilmez; `render({ rowPath, path, control,
 *    rowIndex, row })` callback'i verilir → caller doğrudan field primitive'i
 *    yazar. Multi-field davranışlar (CurrencyField) ve özel prop'lar bu sayede
 *    özel kasa istemeden çalışır.
 *  - Read-only computed cell'ler için ayrı `compute(row): ReactNode` varyantı.
 *  - View/edit modu field primitive'leri context'ten (`useFormMode`) okur —
 *    TableField cell'lere mod geçirmez; sadece kendi chrome'unu (delete column,
 *    add button) gizler.
 *  - Yeni satıra `crypto.randomUUID()` (caller'ın `newRow` factory'sinde) atanır;
 *    backend `CollectionSync.Merge` `Guid.Empty` yerine string id'leri yeni
 *    kayıt olarak ekler.
 */

export type TableFieldRenderArgs<
  TValues extends FieldValues,
  TRow extends object,
> = {
  /** Satırın form path prefix'i, ör. "products.0". */
  rowPath: FieldPath<TValues>;
  /** Satır içindeki bir alt-alanın tipli path'ini üretir, ör. path('quantity'). */
  path: (suffix: string) => FieldPath<TValues>;
  control: Control<TValues>;
  rowIndex: number;
  /** Satırın anlık snapshot'ı (useWatch ile yenilenir). */
  row: TRow;
};

type TableFieldColumnBase = {
  /** React listesi için stabil key + a11y için kolon kimliği. */
  key: string;
  header: string;
  /** CSS grid track ('1fr', '110px', vb.). Default '1fr'. */
  width?: string;
  align?: 'left' | 'right' | 'center';
  hideInMode?: FormMode[];
};

export type TableFieldColumn<
  TValues extends FieldValues,
  TRow extends object,
> = TableFieldColumnBase &
  (
    | { render: (args: TableFieldRenderArgs<TValues, TRow>) => ReactNode }
    | { compute: (row: TRow) => ReactNode }
  );

export interface TableFieldProps<
  TValues extends FieldValues,
  TRow extends object,
> {
  control: Control<TValues>;
  /** Form'daki dizi alanı, ör. "products" / "emails". */
  name: ArrayPath<TValues>;
  columns: TableFieldColumn<TValues, TRow>[];
  /** Yeni satır factory'si. `id: crypto.randomUUID()` içermesi önerilir. */
  newRow: () => TRow;
  addLabel?: string;
  /** Boş durumda EmptyState'in açıklaması. Verilmezse common:messages.noData. */
  emptyLabel?: string;
  /** Default true; edit modunda her satıra sil butonu kolonu ekler. */
  showDelete?: boolean;
  force?: 'readonly' | 'editable';
  hideInMode?: FormMode[];
  /**
   * Bir satırın herhangi bir alanı değiştiğinde tetiklenir. Top-level alanlar
   * shallow eşitlikle (Object.is) karşılaştırılır; değişen her alan için
   * ayrı bir çağrı yapılır. Add/remove satır olayları için satır mevcut olduğu
   * sürece tetiklenir; eklenen yeni satırın initial alanları diff'lenmez —
   * topluca veri güncellemek isteyen caller'lar ayrıca `useWatch(name)` ile
   * dizinin tamamını izleyebilir.
   */
  onRowChange?: (rowIndex: number, field: string, value: unknown) => void;
}

export function TableField<
  TValues extends FieldValues,
  TRow extends object,
>({
  control,
  name,
  columns,
  newRow,
  addLabel = 'Satır Ekle',
  emptyLabel,
  showDelete = true,
  force,
  hideInMode,
  onRowChange,
}: TableFieldProps<TValues, TRow>) {
  const { mode } = useFormMode();

  if (hideInMode?.includes(mode)) return null;

  const isView = force === 'readonly' || (force !== 'editable' && mode === 'view');
  const showActions = showDelete && !isView;

  // Bu modda gizlenmeyen kolonlar.
  const visibleColumns = columns.filter((c) => !c.hideInMode?.includes(mode));

  // Grid track template — opsiyonel delete kolonu ile.
  const gridTemplateColumns = useMemo(() => {
    const tracks = visibleColumns.map((c) => c.width ?? '1fr');
    if (showActions) tracks.push('40px');
    return tracks.join(' ');
  }, [visibleColumns, showActions]);

  const { fields, append, remove } = useFieldArray<TValues>({ control, name });

  return (
    <div>
      <div className="table-field">
        <div
          className="table-field-row table-field-header"
          style={{ gridTemplateColumns }}
        >
          {visibleColumns.map((col) => (
            <div
              key={col.key}
              className={col.align === 'right' ? 'table-field-right' : undefined}
              style={col.align === 'center' ? { textAlign: 'center' } : undefined}
            >
              {col.header}
            </div>
          ))}
          {showActions && <div />}
        </div>

        {fields.length === 0 ? (
          <div className="table-field-empty">
            <EmptyState description={emptyLabel} size="small" />
          </div>
        ) : (
          fields.map((f, rowIndex) => (
            <TableFieldRow<TValues, TRow>
              key={f.id}
              control={control}
              name={name}
              rowIndex={rowIndex}
              visibleColumns={visibleColumns}
              gridTemplateColumns={gridTemplateColumns}
              showActions={showActions}
              onRemove={() => remove(rowIndex)}
              onRowChange={onRowChange}
            />
          ))
        )}
      </div>

      {!isView && (
        <Button
          type="dashed"
          block
          icon={<PlusOutlined />}
          onClick={() =>
            append(newRow() as unknown as FieldArray<TValues, ArrayPath<TValues>>)
          }
          style={{ marginTop: 12, marginBottom: 16 }}
        >
          {addLabel}
        </Button>
      )}
    </div>
  );
}

/**
 * Tek bir satırı izole render eder — kendi `useWatch`'ı sayesinde diğer
 * satırların değişikliği bu satırı re-render etmez.
 */
function TableFieldRow<
  TValues extends FieldValues,
  TRow extends object,
>({
  control,
  name,
  rowIndex,
  visibleColumns,
  gridTemplateColumns,
  showActions,
  onRemove,
  onRowChange,
}: {
  control: Control<TValues>;
  name: ArrayPath<TValues>;
  rowIndex: number;
  visibleColumns: TableFieldColumn<TValues, TRow>[];
  gridTemplateColumns: string;
  showActions: boolean;
  onRemove: () => void;
  onRowChange?: (rowIndex: number, field: string, value: unknown) => void;
}) {
  const rowPath = `${name}.${rowIndex}` as FieldPath<TValues>;
  const row = (useWatch({ control, name: rowPath }) ?? {}) as TRow;
  const path = (suffix: string) =>
    `${name}.${rowIndex}.${suffix}` as FieldPath<TValues>;

  // Satır snapshot diff'i — her useWatch güncellemesinde değişen top-level
  // alanlar için onRowChange'i tetikle. İlk render'da prev === row olduğundan
  // diff boş; sonraki render'larda gerçek değişiklikler yakalanır.
  const prevRowRef = useRef<TRow>(row);
  useEffect(() => {
    if (!onRowChange) return;
    const prev = prevRowRef.current;
    if (prev !== row) {
      const keys = new Set<string>([
        ...Object.keys((prev as object) ?? {}),
        ...Object.keys((row as object) ?? {}),
      ]);
      const prevAny = prev as Record<string, unknown>;
      const rowAny = row as Record<string, unknown>;
      for (const key of keys) {
        if (!Object.is(prevAny?.[key], rowAny?.[key])) {
          onRowChange(rowIndex, key, rowAny?.[key]);
        }
      }
      prevRowRef.current = row;
    }
  }, [row, onRowChange, rowIndex]);

  return (
    <div className="table-field-row" style={{ gridTemplateColumns }}>
      {visibleColumns.map((col) => (
        <div
          key={col.key}
          className={col.align === 'right' ? 'table-field-right' : undefined}
          style={col.align === 'center' ? { textAlign: 'center' } : undefined}
        >
          {'compute' in col
            ? col.compute(row)
            : col.render({ rowPath, path, control, rowIndex, row })}
        </div>
      ))}
      {showActions && (
        <div>
          <Button
            type="text"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={onRemove}
            aria-label="Satırı sil"
          />
        </div>
      )}
    </div>
  );
}
