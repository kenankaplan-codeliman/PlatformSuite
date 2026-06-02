import { Table, type TableProps } from 'antd';

export interface DataTableColumn<T> {
  key: string;
  title: string;
  dataIndex?: keyof T | (keyof T)[];
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
  width?: number | string;
  fixed?: 'left' | 'right';
  ellipsis?: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: keyof T | ((record: T) => string);
  loading?: boolean;
  onRowClick?: (record: T) => void;
  emptyText?: string;
  size?: 'small' | 'middle' | 'large';
}

/**
 * shared/ui — antd Table wrapper'ı.
 * Liste sayfaları bu primitifi tüketir; antd Table'ı doğrudan import etmez.
 */
export function DataTable<T extends object>({
  columns,
  data,
  rowKey,
  loading,
  onRowClick,
  emptyText,
  size = 'middle',
}: DataTableProps<T>) {
  const antColumns: TableProps<T>['columns'] = columns.map((c) => ({
    key: c.key,
    title: c.title,
    dataIndex: c.dataIndex as string | string[] | undefined,
    render: c.render,
    width: c.width,
    fixed: c.fixed,
    ellipsis: c.ellipsis,
    align: c.align,
  }));

  return (
    <Table<T>
      columns={antColumns}
      dataSource={data}
      rowKey={rowKey as never}
      loading={loading}
      size={size}
      pagination={false}
      locale={emptyText ? { emptyText } : undefined}
      onRow={
        onRowClick
          ? (record) => ({
              onClick: () => onRowClick(record),
              style: { cursor: 'pointer' },
            })
          : undefined
      }
    />
  );
}
