import { Children, isValidElement, type ReactNode } from 'react';

/**
 * `FormRow` içinde bir child'ın kaç sütun kaplayacağını belirtmek için
 * field primitiflerinin extend ettiği layout prop'u.
 *
 * Field component'ları bu prop'u kendi render'larında kullanmaz — `FormRow`
 * her child'ın `columns` prop'unu okuyup wrapper'ına `grid-column: span N` uygular.
 */
export interface FormRowItemProps {
  /** FormRow içinde kaç sütun kaplayacağı (default 1). */
  columns?: number;
}

export interface FormRowProps {
  children: ReactNode;
  /** Toplam sütun sayısı. Belirtilmezse children sayısı kadar eşit pay. */
  columns?: number;
  /** Sütunlar arası yatay boşluk. Default 16 (FormSection padding'i ile uyumlu). */
  gap?: number;
}

/**
 * Aynı satırda birden fazla form alanını yan yana dizer.
 * Child'ların `columns` prop'u verilerek tek tek span ayarlanabilir
 * (örn. `<TextField columns={2} />` 2 sütun kaplar).
 */
export function FormRow({ children, columns, gap = 16 }: FormRowProps) {
  const items = Children.toArray(children);
  const cols = columns ?? items.length;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        columnGap: gap,
        rowGap: 0,
      }}
    >
      {items.map((child, i) => {
        const span = isValidElement(child)
          ? (child.props as FormRowItemProps).columns ?? 1
          : 1;
        return (
          <div
            key={i}
            style={{
              gridColumn: `span ${span}`,
              minWidth: 0,
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
