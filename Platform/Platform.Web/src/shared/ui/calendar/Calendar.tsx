import { Calendar as AntCalendar, ConfigProvider } from 'antd';
import trTR from 'antd/locale/tr_TR';
import type { Dayjs } from 'dayjs';
import type { ReactNode } from 'react';

export type CalendarCellType =
  | 'time'
  | 'date'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'
  | 'decade';

export interface CalendarCellInfo {
  type: CalendarCellType;
  originNode: ReactNode;
}

export interface CalendarHeaderProps {
  value: Dayjs;
  onChange: (date: Dayjs) => void;
}

export interface CalendarProps {
  value: Dayjs;
  onSelect?: (date: Dayjs) => void;
  cellRender?: (current: Dayjs, info: CalendarCellInfo) => ReactNode;
  headerRender?: (props: CalendarHeaderProps) => ReactNode;
}

/**
 * shared/ui — antd Calendar + Türkçe locale wrapper'ı.
 * `dayjs` üzerinden çalışır; sayfa kodu antd/ConfigProvider'ı tüketmez.
 */
export function Calendar({
  value,
  onSelect,
  cellRender,
  headerRender,
}: CalendarProps) {
  return (
    <ConfigProvider locale={trTR}>
      <AntCalendar
        value={value}
        onSelect={onSelect}
        cellRender={cellRender}
        headerRender={headerRender as never}
      />
    </ConfigProvider>
  );
}
