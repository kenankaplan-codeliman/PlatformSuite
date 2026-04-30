import { type ReactNode } from "react";
import { Pagination, Space, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { Button } from "../Button";
import { DataTable, type DataTableColumn } from "../DataTable";
import { Alert } from "../feedback/Alert";
import type {
  PaginationRequest,
  PaginationResponse,
} from "../../types/Pagination";

const { Title } = Typography;

export interface ListPageLayoutProps<T> {
  title: string;
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: keyof T | ((record: T) => string);
  isLoading?: boolean;
  error?: unknown;

  pagination: PaginationRequest;
  paginationResponse?: PaginationResponse;
  onPaginationChange: (next: PaginationRequest) => void;

  filterBar?: ReactNode;
  headerActions?: ReactNode;

  onCreateClick?: () => void;
  createLabel?: string;

  onRowClick?: (record: T) => void;
}

export function ListPageLayout<T extends object>({
  title,
  columns,
  data,
  rowKey,
  isLoading,
  error,
  pagination,
  paginationResponse,
  onPaginationChange,
  filterBar,
  headerActions,
  onCreateClick,
  createLabel,
  onRowClick,
}: ListPageLayoutProps<T>) {
  const { t } = useTranslation("common");

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          {title}
        </Title>
        <Space>
          {headerActions}
          {onCreateClick && (
            <Button type="primary" onClick={onCreateClick}>
              {createLabel ?? t("actions.create")}
            </Button>
          )}
        </Space>
      </div>

      {filterBar && <div style={{ marginBottom: 16 }}>{filterBar}</div>}

      {error ? (
        <Alert type="error" message={t("messages.unexpectedError")} />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={data}
            rowKey={rowKey}
            loading={isLoading}
            onRowClick={onRowClick}
          />

          <div
            style={{
              marginTop: 16,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Pagination
              current={pagination.pageNumber}
              pageSize={pagination.pageSize}
              simple
              showSizeChanger={false}
              total={
                paginationResponse?.hasMoreRecord
                  ? pagination.pageNumber * pagination.pageSize + 1
                  : pagination.pageNumber * pagination.pageSize
              }
              onChange={(pageNumber) =>
                onPaginationChange({
                  pageNumber,
                  pageSize: pagination.pageSize,
                })
              }
              disabled={isLoading}
            />
          </div>
        </>
      )}
    </div>
  );
}
