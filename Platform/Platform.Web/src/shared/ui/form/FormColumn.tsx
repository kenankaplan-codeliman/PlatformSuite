import type { ReactNode } from 'react';
import type { FormRowItemProps } from './FormRow';

export interface FormColumnProps extends FormRowItemProps {
  children: ReactNode;
  /** Alanlar arası dikey boşluk. Default 0 (field'ların kendi Form.Item margin'i devreye girer). */
  gap?: number;
}

/**
 * `FormRow`'un dikey simetriği: bir FormRow hücresi içinde birden fazla alanı
 * alt alta istifler.
 *
 * `columns` prop'u (FormRowItemProps) dışa dönüktür — `FormRow` bu değeri okuyup
 * sütununa `grid-column: span N` uygular; yani FormColumn, FormRow içinde tek bir
 * item gibi davranır ama içinde alanları dikey dizer.
 *
 * NOT: Section seviyesinde (FormRow dışında) alanları alt alta dizmek için buna
 * gerek yoktur — field'lar zaten block akışında istiflenir. FormColumn yalnızca
 * bir FormRow hücresinin içinde anlamlıdır.
 */
export function FormColumn({ children, gap = 0 }: FormColumnProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: gap,
        minWidth: 0,
      }}
    >
      {children}
    </div>
  );
}
