import React from 'react';
import { Button, Select, Space } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { StateType, useProcessState } from "@/stores/process.state.store";

export interface CustomPaginationProps {
  current: number;
  pageSize: number;
  hasMore: boolean;
  totalItems?: number;
  pageSizeOptions?: number[];
  showPageSizeChanger?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  current,
  pageSize,
  hasMore,
  totalItems = 0,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSizeChanger = true,
  onPageChange,
  onPageSizeChange,
}) => {
  const startItem = totalItems > 0 ? (current - 1) * pageSize + 1 : 0;
  const endItem = (current - 1) * pageSize + totalItems;

  const handlePrevious = () => {
    if (current > 1) {
      onPageChange(current - 1);
    }
  };

  const handleNext = () => {
    if (hasMore) {
      onPageChange(current + 1);
    }
  };

  const { state } = useProcessState.getState();

  return (
    <div
      style={{
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid #f0f0f0',
      }}
    >
      <span style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: 14 }}>
        {totalItems > 0 ? (
          <>
            <strong>{startItem}-{endItem}</strong> kayıt gösteriliyor
            {hasMore && <span style={{ color: '#1890ff', marginLeft: 4 }}>(devamı var)</span>}
          </>
        ) : (
          'Kayıt bulunamadı'
        )}
      </span>

      <Space size="middle">
        {showPageSizeChanger && (
          <Select
            value={pageSize}
            onChange={onPageSizeChange}
            disabled={state === StateType.Loading}
            style={{ width: 80 }}
            options={pageSizeOptions.map((size) => ({
              value: size,
              label: `${size}`,
            }))}
          />
        )}

        <Space size={4}>
          <Button
            size="small"
            icon={<LeftOutlined />}
            disabled={current === 1 || state === StateType.Loading}
            onClick={handlePrevious}
          />
          <span
            style={{
              minWidth: 70,
              textAlign: 'center',
              display: 'inline-block',
              fontSize: 14,
            }}
          >
            Sayfa {current}
          </span>
          <Button
            size="small"
            icon={<RightOutlined />}
            disabled={!hasMore || state === StateType.Loading}
            onClick={handleNext}
          />
        </Space>
      </Space>
    </div>
  );
};

export default CustomPagination;
